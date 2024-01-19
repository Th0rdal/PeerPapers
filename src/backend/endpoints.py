import logging
import math
import os

from flask import Flask, abort, request, jsonify, send_file, make_response

from util import hashPassword, checkHashedPassword, getTotalPath, createJWTToken, createUUID, isJWTValid, getJWTPayload, \
    calculateRankString, rankGainCalculator

from database.Table import Table
from database.database import DatabaseAccessObject
from database.exceptions import NoRowFoundException

app = Flask(__name__)


# app.config['SECRET_KEY'] = '1234'
# app.config['ALLOWED_EXTENSIONS'] = {'pdf'}
@app.before_request
def checkAuthentication():
    if "/register" in request.full_path or "/login" in request.full_path:
        return
    if isJWTValid(request.headers.get('Authorization')):
        return
    return jsonify("error: invalid token!"), 400


# MUST
@app.route('/register', methods=['POST'])
def register():
    '''
    Endpoint for user registration with username and password. Username and password must be sent in method body.
    '''
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        logging.info('Registration not successful')
        return jsonify({'error': 'Both username and password are required'}), 400
    databaseAccess = DatabaseAccessObject()
    try:
        databaseAccess.findOne(Table.AUTHENTICATION, {'username': username})
        logging.info('Username is taken')
        return jsonify({'message': 'Username is already taken'}), 400
    except NoRowFoundException as e:  # When NoRowFoundException is triggered, username is not taken.
        databaseAccess.newEntry(Table.AUTHENTICATION, {'username': username, 'password': hashPassword(password)})
        databaseAccess.newEntry(Table.USER, {'username': username, 'rank': 1, 'bookmarks': '', 'upvotedFiles': ''})
    logging.info('Registration successful')
    return jsonify({'message': 'Registration successful'}), 200


@app.route('/login', methods=['POST'])
def login():
    '''
    Endpoint for user login with username and password. Username and password must be sent in method body.
    Wir werden später einen JWT in der response schicken, also am besten bereits die function zum erstellen des JWT kreieren
    und einfach in den körper pass schreiben. Ist egal, dass das jwt feld leer ist. Du willst immer eine function fertig schreiben, selbst
    wenn manche sachen noch nicht implementiert sind. Später zurück zur funktion ist immer schlecht
    '''
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not data or not username or not password:
        logging.info('Login not successful, username and password are required')
        return jsonify({'error': 'Username or Password incorrect'}), 400

    databaseAccess = DatabaseAccessObject()

    try:
        row = databaseAccess.findOne(Table.AUTHENTICATION,
                                     {'username': username})  # checks if username and pw matches with existing one
        if checkHashedPassword(row["password"], password):
            userRow = databaseAccess.findOne(Table.USER, {"username": username})
            return jsonify(
                {'message': 'Login successful', "token": f"Bearer {createJWTToken(username, userRow['id'])}"})
        return jsonify({"message": "Username or Password incorrect"}, 400)
    except NoRowFoundException as e:  # When NoRowFoundException is triggered, username is not taken.
        logging.info('Login not successful, username or password incorrect')
        return jsonify({'message': 'Username or Password incorrect'}), 400


@app.route('/upload', methods=['POST'])
def upload():
    databaseAccess = DatabaseAccessObject()

    fileUUID = createUUID()
    # Zugriff auf die gesendeten Daten und Dateien mit request
    title = request.form.get('title')
    author = request.form.get('author')
    semester = request.form.get('semester')
    year = request.form.get('year')
    department = request.form.get('department')

    relative_path = getTotalPath("resources/database/files")

    # Kombiniere den relativen Pfad mit dem Dateinamen
    save_path = os.path.join(relative_path, fileUUID + ".pdf")

    uploadFile = {
        "id": fileUUID,
        "title": title,
        "author": author,
        "semester": semester,
        "year": year,
        "department": department,
        "upvotes": 0
    }

    databaseAccess.newEntry(Table.FILES, uploadFile)

    # Zugriff auf die hochgeladene Datei
    file = request.files.get('file')

    if not file:
        return jsonify({'error': 'Keine Datei hochgeladen'}), 400

    # Erstelle den relativen Pfad, z.B. "Peerpapers/resources/database/files"

    # Speichere die Datei auf dem Server im relativen Pfad
    file.save(save_path)

    # Gib eine Erfolgsmeldung zurück
    return jsonify({'message': 'Datei erfolgreich hochgeladen'}), 200


@app.route('/download', methods=['GET'])
def download():
    iD = request.args.get('id')

    relative_path = getTotalPath("resources/database/files")
    fullPath = relative_path + ("/" + iD + ".pdf")

    if not os.path.exists(fullPath):
        # Wenn die Datei nicht existiert, sende einen 500-Fehler
        abort(404)

    return send_file(fullPath, as_attachment=True)

    pass


# SHOULD
@app.route('/filter', methods=['GET'])
def filter():
    databaseAccess = DatabaseAccessObject()

    searchDict = {}
    for key, value in request.args.items():
        searchDict[key] = value

    filteredFiles = databaseAccess.find(Table.FILES, searchDict)
    return jsonify({'message': 'successful filtered'}, filteredFiles, 200)


@app.route('/upvote', methods=['PUT'])
def upvote():
    fileID = request.args.get('fileID')
    userID = getJWTPayload(request.headers.get('Authorization'))["id"]
    databaseAccess = DatabaseAccessObject()
    userRow = databaseAccess.findOne(Table.USER, {"id": userID})

    addBookmarkFlag = True
    for key in userRow["upvotedFiles"]:
        if key == fileID:
            addBookmarkFlag = False

    rankgain = rankGainCalculator(userRow["rank"], databaseAccess.averageRank, databaseAccess.rankMultiplier["upvote"])
    if addBookmarkFlag:
        temp = userRow["rank"] + rankgain
        databaseAccess.addToList(Table.USER, {"id": userID}, {"upvotedFiles": fileID})
        databaseAccess.update(Table.USER, {"id": userID}, {"rank": temp})
    else:
        temp = userRow["rank"] - rankgain if userRow["rank"] - rankgain > 0 else 0
        databaseAccess.deleteFromList(Table.USER, {"id": userID}, {"upvotedFiles": fileID})
        databaseAccess.update(Table.USER, {"id": userID}, {"rank": temp})
    databaseAccess.update(Table.FILES, {"id": fileID}, {"upvotes": "+1" if addBookmarkFlag else "-1"})
    databaseAccess.calculateRankValues()
    return make_response("", 200)


# COULD
@app.route('/bookmarks', methods=['GET'])
def bookmarks():
    data = getJWTPayload(request.headers.get('Authorization'))
    databaseAccess = DatabaseAccessObject()

    bookmarks = databaseAccess.findOne(Table.USER, {"id": data["id"]})["bookmarks"]
    result = {}
    for bookmark in bookmarks:
        row = databaseAccess.findOne(Table.FILES, {"id": bookmark})
        result[row["id"]] = row
    return jsonify({'message': 'successful filtered'}, result), 200


@app.route('/bookmark', methods=['PUT'])
def bookmark():
    data = request.get_json()
    fileID = data.get('fileID')
    userID = getJWTPayload(request.headers.get('Authorization'))["id"]
    databaseAccess = DatabaseAccessObject()
    userBookmarks = databaseAccess.findOne(Table.USER, {"id": userID})["bookmarks"]

    addBookmarkFlag = True
    for key in userBookmarks:
        if key == fileID:
            addBookmarkFlag = False

    if addBookmarkFlag:
        databaseAccess.addToList(Table.USER, {"id": userID}, {"bookmarks": fileID})
    else:
        databaseAccess.deleteFromList(Table.USER, {"id": userID}, {"bookmarks": fileID})
    return make_response("", 200)


@app.route('/rank', methods=['GET'])
def rank():
    userID = getJWTPayload(request.headers.get('Authorization'))["id"]
    databaseAccess = DatabaseAccessObject()

    user = databaseAccess.findOne(Table.USER, {"id": userID})
    return jsonify(
        {"rankPoints": math.floor(user["rank"]), "rank": calculateRankString(user["rank"], databaseAccess.rankDict)}), 200


@app.route('/rankList', methods=['GET'])
def rankList():
    return jsonify(DatabaseAccessObject().getTopRanks(100)), 200


def startServer():
    path = os.path.abspath(os.path.join(os.path.abspath(__file__), "..", "..", "..", "log", "logFile.log"))
    logging.basicConfig(filename=path, level=logging.INFO, format="%(asctime)s:%(filename)s:%(message)s")
    logging.info('Starting the server')
    app.run(debug=True, port=25202)


if __name__ == '__main__':
    startServer()
