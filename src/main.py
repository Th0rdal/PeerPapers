import logging
from src.backend import endpoints

if __name__ == '__main__':
    logging.basicConfig(filename="log/logFile.log", level=logging.INFO, format="%(asctime)s:%(filename)s:%(message)s")
    endpoints.startServer()
