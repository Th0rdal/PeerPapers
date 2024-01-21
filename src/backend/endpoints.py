import logging
import math
import os
from pathlib import Path

from flask import Flask, abort, request, jsonify, send_file, make_response

from util import hashPassword, checkHashedPassword, getTotalPath, createJWTToken, createUUID, isJWTValid, getJWTPayload, \
    calculateRankString, rankGainCalculator, isPDF

from database.Table import Table
from database.database import DatabaseAccessObject
from database.exceptions import NoRowFoundException

app = Flask(__name__)


@app.before_request
def checkAuthentication():
    """
    Checks if the Token sent in the Authorization header is valid.
    :return: Error code 400 if the Token is not valid
    """
    if "/register" in request.full_path or "/login" in request.full_path:
        return
    if isJWTValid(request.headers.get('Authorization')):
        return
    return jsonify("error: invalid token!"), 400


# MUST
@app.route('/register', methods=['POST'])
def register():
    """
    Registers a user and adds it to the database.
    :return: 400 if the token is not valid, else 200
    """

    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    logging.info(f"Received register request from user {username}")
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
        databaseAccess.newEntry(Table.USER, {'username': username, 'rank': 1, 'bookmarks': '', 'upvotedFiles': '',
                                             "downloadedFiles": ""})
    logging.info('Registration successful')
    return jsonify({'message': 'Registration successful'}), 200


@app.route('/login', methods=['POST'])
def login():
    """
    Compares login credentials and creates Token for session.
    :return: 400 if the credentials are not matching, else 200 and the Token
    """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    logging.info(f"Received login request from user {username}")
    if not data or not username or not password:
        logging.info('Login not successful, username and password are required')
        return jsonify({'error': 'Username or Password incorrect'}), 400

    databaseAccess = DatabaseAccessObject()

    try:
        row = databaseAccess.findOne(Table.AUTHENTICATION,
                                     {'username': username})  # checks if username and pw matches with existing one
        if checkHashedPassword(row["password"], password):
            userRow = databaseAccess.findOne(Table.USER, {"username": username})
            logging.info(f"User {userRow['id']} logged in successfully")
            return jsonify(
                {'message': 'Login successful', "token": f"Bearer {createJWTToken(username, userRow['id'])}"})

        logging.info(f'Login not successful, username or password incorrect')
        return jsonify({"message": "Username or Password incorrect"}, 400)
    except NoRowFoundException as e:  # When NoRowFoundException is triggered, username is not taken.
        logging.info(f'Login not successful, username or password incorrect')
        return jsonify({'message': 'Username or Password incorrect'}), 400


@app.route('/upload', methods=['POST'])
def upload():
    databaseAccess = DatabaseAccessObject()

    fileUUID = createUUID()

    title = request.form.get('title')
    author = request.form.get('author')
    semester = request.form.get('semester')
    year = request.form.get('year')
    department = request.form.get('department')

    relative_path = getTotalPath("resources/database/files")
    save_path = os.path.join(relative_path, fileUUID + ".pdf")

    uploadFile = {
        "id": fileUUID,
        "title": title,
        "author": author,
        "semester": semester,
        "year": year,
        "department": department,
        "upvotes": 0,
        "downloads": 0
    }

    logging.info(
        f'Received upload request from user ({getJWTPayload(request.headers.get("Authorization"))["id"]}). {uploadFile}')

    databaseAccess.newEntry(Table.FILES, uploadFile)
    file = request.files.get('file')

    if not file:
        logging.info(f"No file was received")
        return jsonify({'error': 'Keine Datei hochgeladen'}), 400

    file.save(save_path)

    if isPDF(save_path):
        return jsonify({'message': 'Datei erfolgreich hochgeladen'}), 200
    else:
        os.remove(save_path)
        logging.info(f"The received file was not a pdf ({uploadFile})")
        return jsonify({"error": "Datei ist kein pdf"}), 400


@app.route('/download', methods=['GET'])
def download():
    fileID = request.args.get('id')
    userID = getJWTPayload(request.headers.get('Authorization'))["id"]
    databaseAccess = DatabaseAccessObject()
    relative_path = getTotalPath("resources/database/files")
    fullPath = os.path.join(relative_path, fileID + ".pdf")

    logging.info(f"Received download request from user ({userID}) for file {fileID}")

    userRow = databaseAccess.findOne(Table.USER, {"id": userID})
    databaseAccess.update(Table.FILES, {"id": fileID}, {"downloads": "+1"})

    downloadedFilesFlag = False
    for key in userRow["downloadedFiles"]:
        if key == fileID:
            downloadedFilesFlag = True

    if not downloadedFilesFlag:
        rankgain = rankGainCalculator(databaseAccess.rankMultiplier["upvote"])
        temp = userRow["rank"] + rankgain
        logging.info(
            f"User {userID} received {rankgain} points (current rank points: {temp}) for a file download of file {fileID}")
        databaseAccess.addToList(Table.USER, {"id": userID}, {"downloadedFiles": fileID})
        databaseAccess.update(Table.USER, {"id": userID}, {"rank": temp})

    if not os.path.exists(fullPath):
        logging.info(f"File {fileID} does not exist")
        abort(404)

    return send_file(fullPath, as_attachment=True)


# SHOULD
@app.route('/filter', methods=['GET'])
def filter():
    databaseAccess = DatabaseAccessObject()

    searchDict = {}
    for key, value in request.args.items():
        searchDict[key] = value

    logging.info(f"Received a filter request with the parameter {searchDict}")
    filteredFiles = databaseAccess.find(Table.FILES, searchDict)

    return jsonify({'message': 'successful filtered',
                    "yearFilter": list(databaseAccess.getAllValuesFromColumn(Table.FILES, "year")),
                    "semesterFilter": list(databaseAccess.getAllValuesFromColumn(Table.FILES, "semester")),
                    "departmentFilter": list(databaseAccess.getAllValuesFromColumn(Table.FILES, "department"))},
                   filteredFiles, 200)


@app.route('/upvote', methods=['PUT'])
def upvote():
    fileID = request.args.get('fileID')
    userID = getJWTPayload(request.headers.get('Authorization'))["id"]
    logging.info(f"Received an upvote request from {userID} for the file {fileID}")

    databaseAccess = DatabaseAccessObject()
    userRow = databaseAccess.findOne(Table.USER, {"id": userID})

    addUpvoteFlag = True
    for key in userRow["upvotedFiles"]:
        if key == fileID:
            addUpvoteFlag = False

    rankgain = rankGainCalculator(databaseAccess.rankMultiplier["upvote"])
    rankGainUsername = databaseAccess.findOne(Table.FILES, {"id": fileID})["author"]
    rankGainUser = databaseAccess.findOne(Table.USER, {"username": rankGainUsername})
    if addUpvoteFlag:
        temp = userRow["rank"] + rankgain
        logging.info(
            f"User {rankGainUser} received {rankgain} points (current rank points: {temp}) for an upvote of file {fileID}")
        databaseAccess.addToList(Table.USER, {"id": userID}, {"upvotedFiles": fileID})
        databaseAccess.update(Table.USER, {"id": rankGainUser}, {"rank": temp})
    else:
        temp = userRow["rank"] - rankgain if userRow["rank"] - rankgain > 0 else 0
        logging.info(
            f"User {rankGainUser} lost {rankgain} points (current rank points: {temp}) for a lost upvote of file {fileID}")
        databaseAccess.deleteFromList(Table.USER, {"id": userID}, {"upvotedFiles": fileID})
        databaseAccess.update(Table.USER, {"id": rankGainUser}, {"rank": temp})

    databaseAccess.update(Table.FILES, {"id": fileID}, {"upvotes": "+1" if addUpvoteFlag else "-1"})
    databaseAccess.calculateRankValues()
    return make_response("", 200)


# COULD
@app.route('/bookmarks', methods=['GET'])
def bookmarks():
    data = getJWTPayload(request.headers.get('Authorization'))
    databaseAccess = DatabaseAccessObject()

    logging.info(f"Received a get bookmarks request from user {data['id']}")

    try:
        bookmarks = databaseAccess.findOne(Table.USER, {"id": data["id"]})["bookmarks"]
    except NoRowFoundException as e:
        bookmarks = []

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

    logging.info(f"Received a put bookmark request from user {userID} for file {fileID}")

    databaseAccess = DatabaseAccessObject()
    userBookmarks = databaseAccess.findOne(Table.USER, {"id": userID})["bookmarks"]

    addBookmarkFlag = True
    for key in userBookmarks:
        if key == fileID:
            addBookmarkFlag = False

    if addBookmarkFlag:
        logging.info(f"Added bookmark for file {fileID} to user {userID}")
        databaseAccess.addToList(Table.USER, {"id": userID}, {"bookmarks": fileID})
    else:
        logging.info(f"Deleted bookmark for file {fileID} to user {userID}")
        databaseAccess.deleteFromList(Table.USER, {"id": userID}, {"bookmarks": fileID})
    return make_response("", 200)


@app.route('/rank', methods=['GET'])
def rank():
    userID = getJWTPayload(request.headers.get('Authorization'))["id"]
    databaseAccess = DatabaseAccessObject()

    user = databaseAccess.findOne(Table.USER, {"id": userID})
    rankPoints = math.floor(user["rank"])
    rank = calculateRankString(user["rank"], databaseAccess.rankDict)

    logging.info(f"Received a get rank request from user {userID}. Current rank is {rank} ({rankPoints}). Rank dictionary at the time is {databaseAccess.rankDict}")

    return jsonify({
        "rankPoints": rankPoints,
        "rank": rank
    }), 200


@app.route('/rankList', methods=['GET'])
def rankList():
    logging.info(
        f"Received a get ranklist request from user {getJWTPayload(request.headers.get('Authentication'))['id']}")
    return jsonify(DatabaseAccessObject().getTopRanks(100)), 200


@app.route("/userLists", methods=["GET"])
def userLists():

    databaseAccess = DatabaseAccessObject()
    userID = getJWTPayload(request.headers.get('Authorization'))["id"]
    userRow = databaseAccess.findOne(Table.USER, {"id": userID})

    logging.info(f"Received a get userList request from user {userID}")

    returnDict = {
        "upvotedFiles": userRow["upvotedFiles"],
        "downloadedFiles": userRow["downloadedFiles"],
        "bookmarks": userRow["bookmarks"]
    }
    return jsonify(returnDict), 200


def startServer():
    Path(getTotalPath("log")).mkdir(parents=True, exist_ok=True)
    path = getTotalPath("log/logfile.log")
    logging.basicConfig(filename=path, level=logging.INFO, format="%(asctime)s:%(filename)s:%(message)s")
    logging.info('Starting the server')
    app.run(debug=True, port=25202)


if __name__ == '__main__':
    startServer()
