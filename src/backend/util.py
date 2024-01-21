import logging
import math
import datetime
import os
import uuid
import bcrypt
import jwt
from pypdf import PdfReader
from pypdf.errors import PdfReadError

secret = "PeerPaper" # obviously normally not written here


def createJWTToken(username, id):
    """
    Creates a JWT token with the username, id and expiration date as payload
    :param username: username of the user to create the token for
    :param id: id of the user to create the token for
    :return: JWT
    """
    payload = {
        "username": username,
        "id": id,
        "exp": int((datetime.datetime.utcnow() + datetime.timedelta(hours=5)).timestamp())
    }
    token = jwt.encode(payload, secret, algorithm="HS256")
    logging.info(f"Created JWT token with payload {payload}. Token: {token}")
    return token


def isJWTValid(token):
    """
    Checks if the JWT token is valid based on if the expiration date is not crossed, the signature is not
    expired and the token is not invalid.
    :param token: Token to check
    :return: True if valid, else False
    """
    logging.info(f"Checking validity of JWT token {token}")
    try:
        if token is None:
            return False
        token = token.split(" ")[1]
        decodedToken = jwt.decode(token, secret, algorithms=["HS256"])

        # check expiration date
        if int(decodedToken["exp"]) < datetime.datetime.utcnow().timestamp():
            logging.info(f"JWT token {token} is expired.")
            return False
    except jwt.ExpiredSignatureError:
        logging.info(f"JWT token {token} expired signature error")
        return False
    except jwt.InvalidTokenError:
        logging.info(f"JWT token {token} invalid token error")
        return False
    except IndexError:
        logging.info(f"JWT token {token} is not the right format 'Bearer ' missing!")
        return False
    logging.info(f"JWT token {token} is valid")
    return True


def getJWTPayload(token):
    """
    Decodes and returns the payload of the given JWT token.
    :param token: Token to decode and get the payload from
    :return: payload of token as dict
    """
    return jwt.decode(token.split(" ")[1], secret, algorithms=["HS256"])


def hashPassword(password):
    """
    Hashes a password for saving in the database
    :param password: password to hash
    :return: hashed password
    """
    return bcrypt.hashpw((password + secret).encode('utf-8'), bcrypt.gensalt())


def checkHashedPassword(hashedPW, password):
    """
    This function validates if the given passwords are identical.
    :param hashedPW: The hashed password saved in the database
    :param password: The password to compare it to as string
    :return: True if they are the same, else False
    """
    return bcrypt.checkpw((password + secret).encode('utf-8'), hashedPW)


def getTotalPath(pathAdd):
    """
    calculates the absolute path to the certain file specified in pathAdd.
    :param pathAdd: a string with the path to what you want as if the cwd was PeerPapers. The string needs to be seperated with "/".
    :return: absolute path as string
    """
    components = os.path.abspath(__file__).split(os.path.sep)
    pathAddComponents = pathAdd.split("/")
    i = components.index("PeerPapers")
    path = os.path.join(components[0], os.sep)
    for part in components[1:i + 1]:
        path = os.path.join(path, part)
    for part in pathAddComponents:
        path = os.path.join(path, part)
    return path


def createUUID():
    """
    Creates a valid uuid.
    :return: uuid as string
    """
    return str(uuid.uuid4())


def rankGainCalculator(multiplier):
    """
    Calculates the rank gain for the user.
    :param multiplier: The multiplier to use for the rank gain
    :return: integer with the rank gain for the user
    """
    return math.log(100, 10) * multiplier


def calculateRankString(currentRank, rankDict):
    """
    Converts the rank number into a string corresponding to the rank the user is.
    :param currentRank: The current rank of the user as int
    :param rankDict: A dictionary with the ranks and their corresponding threshold values
    :return: String corresponding to the rank of the user
    """
    for key in rankDict:
        if currentRank <= rankDict[key]:
            return key
    t = min(rankDict, key=lambda k: rankDict[k])
    return t


def isPDF(filepath):
    """
    Checks if the file in the given path is a pdf.
    :param filepath: path to the file to check
    :return: True if it is a pdf, else False
    """
    try:
        PdfReader(filepath)
    except PdfReadError:
        return False
    return True
