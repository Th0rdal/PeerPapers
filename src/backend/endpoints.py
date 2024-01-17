import logging
import os

from flask import Flask, request, jsonify

from util import hashPassword, checkHashedPassword

from database.Table import Table
from database.database import DatabaseAccessObject
from database.exceptions import NoRowFoundException

app = Flask(__name__)


# app.config['SECRET_KEY'] = '1234'
# app.config['ALLOWED_EXTENSIONS'] = {'pdf'}


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
        databaseAccess.newEntry(Table.USER, {'username': username, 'rank': 0, 'bookmarks': '', 'upvotedFiles': ''})
    databaseAccess.printTable(Table.AUTHENTICATION)
    databaseAccess.printTable(Table.USER)
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
    databaseAccess.printTable(Table.AUTHENTICATION)

    try:
        row = databaseAccess.findOne(Table.AUTHENTICATION,
                                     {'username': username})  # checks if username and pw matches with existing one
        if checkHashedPassword(row["password"], password):
            return jsonify({'message': 'Login successful'})
        return jsonify({"message": "Username or Password incorrect"}, 400)
    except NoRowFoundException as e:  # When NoRowFoundException is triggered, username is not taken.
        logging.info('Login not successful, username or password incorrect')
        return jsonify({'message': 'Username or Password incorrect'}), 400


@app.route('/upload', methods=['POST'])
def upload():
      # Zugriff auf die gesendeten Daten und Dateien mit request
    title = request.form.get('title')
    author = request.form.get('author')
    semester = request.form.get('semester')
    year = request.form.get('year')
    department = request.form.get('department')
    
    print("title " + title)
    print("author " + author)
    print("semester " + semester)
    print("year " + year)
    print("department " + department)
    
    # Zugriff auf die hochgeladene Datei
    file = request.files.get('file')
    
    if not file:
        return jsonify({'error': 'Keine Datei hochgeladen'}), 400

    # Erstelle den relativen Pfad, z.B. "Peerpapers/resources/database/files"
    relative_path = os.path.join('resources', 'database', 'files')
    print("relative Path: " + relative_path)
    # Stelle sicher, dass der Zielordner existiert, sonst erstelle ihn
    os.makedirs(relative_path, exist_ok=True)

    # Kombiniere den relativen Pfad mit dem Dateinamen
    save_path = os.path.join(relative_path, file.filename)
    print("save Path " + save_path)
    # Speichere die Datei auf dem Server im relativen Pfad
    file.save(save_path)

    # Gib eine Erfolgsmeldung zurück
    return jsonify({'message': 'Datei erfolgreich hochgeladen'}), 200
    


@app.route('/download', methods=['GET'])
def download():
    pass


# SHOULD
@app.route('/filter', methods=['GET'])
def filter():
    pass


@app.route('/upvote', methods=['PUT'])
def upvote():
    pass


# COULD
@app.route('/bookmarks', methods=['GET'])
def bookmarks():
    pass


@app.route('/bookmark', methods=['PUT'])
def bookmark():
    pass


@app.route('/rank', methods=['GET'])
def rank():
    pass


@app.route('/rankList', methods=['GET'])
def rankList():
    pass


def startServer():
    path = os.path.abspath(os.path.join(os.path.abspath(__file__), "..", "..", "..", "log", "logFile.log"))
    logging.basicConfig(filename=path, level=logging.INFO, format="%(asctime)s:%(filename)s:%(message)s")
    logging.info('Starting the server')
    app.run(debug=True, port=25202)


if __name__ == '__main__':
    startServer()