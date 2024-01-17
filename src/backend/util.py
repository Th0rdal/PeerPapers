import datetime
import os

import bcrypt
import jwt

secret = "PeerPaper"


def create_jwt_token(username, id):  # method to create the jwt token
    payload = {
        "username": username,
        "id": id,
        "expires": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, secret, algorithm="HS256")
    print(token)


def allowed_file(file):
    pass


def hashPassword(password):
    return bcrypt.hashpw((password + secret).encode('utf-8'), bcrypt.gensalt())


def checkHashedPassword(hashedPW, password):
    return bcrypt.checkpw(password.encode('utf-8') + secret, hashedPW)

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