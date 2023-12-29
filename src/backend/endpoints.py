
from flask import Flask, request, jsonify
import sqlite3 as sql
import logging
from database.database import DatabaseAccessObject
from database.Table import Table
from database.exceptions import NoRowFoundException

app = Flask(__name__)

#MUST
@app.route('/register', methods=['POST'])
def register ():
    
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
    except NoRowFoundException as e:
        databaseAccess.newEntry(Table.AUTHENTICATION, {'username': username, 'password': password})
    #databaseAccess.printTable(Table.AUTHENTICATION)
    logging.info('Registration successful')
    return jsonify({'message': 'Registration successful'}), 200

@app.route('/login', methods=['POST'])
def login ():
    pass
    
@app.route('/upload', methods=['POST'])
def upload ():
    pass

@app.route('/download', methods=['GET'])
def download ():
    pass

#SHOULD
@app.route('/filter', methods=['GET'])
def filter ():
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
