import math
from datetime import datetime as dt
import datetime
import os
import uuid
import bcrypt
import jwt

secret = "PeerPaper"


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
        "expires": (datetime.datetime.utcnow() + datetime.timedelta(hours=5)).strftime("%Y-%m-%d-%H:%M")
    }
    return jwt.encode(payload, secret, algorithm="HS256")


def isJWTValid(token):
    """
    Checks if the JWT token is valid based on if the expiration date is not crossed, the signature is not
    expired and the token is not invalid.
    :param token: Token to check
    :return: True if valid, else False
    """
    try:
        if token is None:
            return False
        token = token.split(" ")[1]
        decodedToken = jwt.decode(token, secret, algorithms=["HS256"])

        # check expiration date
        if dt.strptime(decodedToken["expires"], "%Y-%m-%d-%H:%M") < datetime.datetime.utcnow():
            return False
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False
    except IndexError:
        return False
    return True


def getJWTPayload(token):
    """
    Decodes and returns the payload of the given JWT token.
    :param token: Token to decode and get the payload from
    :return: payload of token as dict
    """
    return jwt.decode(token.split(" ")[1], secret, algorithms=["HS256"])


def allowed_file(file):
    pass


def hashPassword(password):
    """
    Hashes a password for saving in the database
    :param password: password to hash
    :return: hashed password
    """
    return bcrypt.hashpw((password + secret).encode('utf-8'), bcrypt.gensalt())


def checkHashedPassword(hashedPW, password):
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
    return math.log(100) * multiplier


def calculateRankString(currentRank, rankDict):

    for key in rankDict:
        if currentRank <= rankDict[key]:
            return key
    t = min(rankDict, key=lambda k: rankDict[k])
    return t
