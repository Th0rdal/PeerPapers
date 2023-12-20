import sqlite3
import logging


class DatabaseAccessObject:
    """
    This class is responsible for providing an interface on which to access the database on.
    """

    def __init__(self):
        pass

    def newEntry(self, table, data):
        pass

    def deleteFromList(self, table, searchData, deleteData):
        pass

    def addToList(self, table, searchData, addData):
        pass

    def insert(self, table, searchData, insertData):
        pass

    def findOne(self, table, searchData):
        pass

    def find(self, searchData):
        pass
