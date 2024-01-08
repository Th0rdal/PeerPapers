
from flask import Flask, request, jsonify
import sqlite3 as sql
import logging
from database.database import DatabaseAccessObject
from database.Table import Table
from database.exceptions import NoRowFoundException

app = Flask(__name__)
#app.config['SECRET_KEY'] = '1234'
#app.config['ALLOWED_EXTENSIONS'] = {'pdf'}

def create_jwt_token(): #method to create the jwt token
    pass

def allowed_file(file):
    pass


#MUST
@app.route('/register', methods=['POST'])
def register ():
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
    except NoRowFoundException as e: #When NoRowFoundException is triggered, username is not taken.
        print("exception triggered")
        databaseAccess.newEntry(Table.AUTHENTICATION, {'username': username, 'password': password})
        databaseAccess.newEntry(Table.USER, {'username': username, 'rank': 0, 'bookmarks': '', 'upvotedFiles': ''})
    databaseAccess.printTable(Table.AUTHENTICATION)
    databaseAccess.printTable(Table.USER)
    logging.info('Registration successful')
    return jsonify({'message': 'Registration successful'}), 200

@app.route('/login', methods=['POST'])
def login ():
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
        databaseAccess.findOne(Table.AUTHENTICATION, {'username': username, 'password': password}) #checks if username and pw matches with existing one
        #user = databaseAccess.find(Table.USER, {'username': username}) #looking for userdata of specific user to receive user id for jwt
        #token = create_jwt_token(user)
        #return jsonify({'message': 'Login successful', 'access_token': token.decode('utf-8')}), 200
        return jsonify({'message': 'Login successful'})
    except NoRowFoundException as e: # When NoRowFoundException is triggered, username is not taken.
        logging.info('Login not successful, username or password incorrect')
        return jsonify({'message': 'Username or Password incorrect'}), 400    
    
    
@app.route('/upload', methods=['POST'])
def upload ():
    
    if 'file' not in request.files:
        return jsonify({'message': 'No file sent'}), 400
    
    file = request.files['file']
    filename = file.name
    print(filename)
    
    
    pass

@app.route('/download', methods=['GET'])
def download ():
    pass

#SHOULD
@app.route('/filter', methods=['GET'])
def filter ():
    return jsonify({'filtertest': 'filterTest'})
    pass

@app.route('/upvote', methods=['PUT'])
def upvote ():
    pass

#COULD
@app.route('/bookmarks', methods=['GET'])
def bookmarks ():
    pass

@app.route('/bookmark', methods=['PUT'])
def bookmark ():
    pass

@app.route('/rank', methods=['GET'])
def rank ():
    pass

@app.route('/rankList', methods=['GET'])
def rankList ():
    pass

app.run(debug=True, port=25202)
