
from flask import Flask, request, jsonify
import sqlite3 as sql
import logging

app = Flask(__name__)

#MUST
@app.route('/register', methods=['POST'])
def register ():
    
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    print(username)
    print(password)
    if not username or not password:
        return jsonify({'error': 'Both username and password are required'}), 400
    con = sql.connect('database.py')
    c = con.cursor()
    c.execute('INSERT INTO authentication (username, password) VALUES (?, ?)', (username, password))
    con.commit()
    con.close()
    
    return jsonify({'message': 'Registration successful'}), 200

    '''
    database_url = 'http://database.py/newEntry'
    
    response = requests.post(database_url, json={'username': username, 'password': password})
    
    if response.status_code == 201:
        return jsonify({'message': 'Registration successful'}), 201
    else:
        return jsonify({'error': 'Error in database layer'}), 500

    '''
    pass

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

if __name__ == '__main__':
    logging.basicConfig(filename="log/logFile.log", level=logging.INFO, format="%(asctime)s:%(filename)s:%(message)s")
    logging.info('Starting the server')
    app.run(debug=True, port=25202)
