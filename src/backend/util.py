import datetime
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
