import bcrypt
import jwt

def create_jwt_token():  # method to create the jwt token
    pass


def allowed_file(file):
    pass


def hashPassword(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())


def checkHashedPassword(hashedPW, password):
    return bcrypt.checkpw(password.encode('utf-8'), hashedPW)
