from flask import Flask
import logging

app = Flask(__name__)

#MUST
@app.route('/register')
def register ():
    pass

@app.route('/login')
def login ():
    pass
    
@app.route('/upload')
def upload ():
    pass

@app.route('/download')
def download ():
    pass

#SHOULD
@app.route('/filter')
def filter ():
    pass

@app.route('/upvote')
def upvote ():
    pass

#COULD
@app.route('/bookmarks')
def bookmarks ():
    pass

@app.route('/bookmark')
def bookmark ():
    pass

@app.route('/rank')
def rank ():
    pass

@app.route('/rankList')
def rankList ():
    pass


if __name__ == '__main__':
    logging.basicConfig(filename="log/logFile.log", level=logging.INFO, format="%(asctime)s:%(filename)s:%(message)s")
    logging.info('Starting the server')
