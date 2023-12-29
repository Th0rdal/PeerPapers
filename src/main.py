import logging

if __name__ == '__main__':
    logging.basicConfig(filename="log/logFile.log", level=logging.INFO, format="%(asctime)s:%(filename)s:%(message)s")
    logging.info('Starting the server')
    import backend.endpoints