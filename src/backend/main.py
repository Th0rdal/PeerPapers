
from flask import Flask, request, jsonify
import logging

app = Flask(__name__)

#MUST
@app.route('/register', methods=['POST'])
def register ():
    
    username = request.data.decode
    #test = request.data
    print(request)
    print(username)
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
