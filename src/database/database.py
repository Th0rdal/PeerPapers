import sqlite3 as sl
import logging
import json

from src.database.Table import Table
from src.database import exceptions


class DatabaseAccessObject:
    """
    This class is responsible for providing an interface on which to access the database on.
    TODO add logging to all classes and implement deleteFromList
    """

    typeCheckMap = {Table.AUTHENTICATION: {"username": "str", "password": "str"},
                    Table.USER: {"id": "str", "username": "str", "rank": "int", "bookmark": "list",
                                 "upvotedFiles": "list"},
                    Table.FILES: {"id": "str", "path": "str", "title": "str", "author": "str", "semester": "int",
                                  "year": "int",
                                  "department": "str", "upvotes": "int"}}

    def __init__(self):
        logging.info("Initializing DatabaseAccessObject")
        self.createNewDatabase()  # this is only to test everything with a database in memory

    def print(self):
        self.c.execute("SELECT * FROM AUTHENTICATION")
        print(self.c.fetchall())

    def newEntry(self, table, data):
        """
        This method is responsible for creating a new entry into a table.
        :param table: Table Enum with the table the new entry should be added to
        :param data: The data of all columns of the table
        :return: None
        """
        logging.info(f'ADDING: Adding a new entry "{data}" to the database {table}')
        if not (result := self._hasAllFields(self.typeCheckMap[table], data)) != None:
            raise exceptions.FieldMissingException(result[1])
        if table == Table.AUTHENTICATION:
            executionText = "INSERT INTO AUTHENTICATION VALUES (:username, :password)"
        elif table == Table.USER:
            executionText = "INSERT INTO USER VALUES (:id, :username, :rank, :bookmark, :upvotedFiles)"
        elif table == Table.FILES:
            executionText = "INSERT INTO FILES VALUES (:id, :path, :title, :author, :semester, :year, :department, :upvotes)"
        with self.conn:
            self.c.execute(executionText, data)

    def _hasAllFields(self, tableType, data):
        """
        This method checks if all the expected keys are present in the data
        :param tableType: An entry of typeCheckMap that represents the table that is currently worked on
        :param data: The data to check
        :return: The field that is missing/too much or None if all fields are accounted for
        """
        for field in tableType:
            if field not in data:
                return field
        return None

    def deleteFromList(self, table, searchData, deleteData):
        pass

    def addToList(self, table, searchData, addData):
        """
        This method adds data to a list column of a table. It can only add to lists!
        :param table: Table Enum with the table the new entry should be added to
        :param searchData: The data which should be used to search the row to manipulate
        :param addData: The data which should be added in form of a dict with the key being the column name
        and the value being the value to add
        :return: None
        :raise MoreThanOneRowFoundException: If there are multiple rows fitting the search criteria
        :raise ColumnNotAListException: If the key of addData is not represented as a list in the table
        """
        try:
            self._checkForListData(table, addData)
            row = self.findOne(table, searchData)
            for element in addData:
                if row[element] == "":
                    addData[element] = json.dumps({"value": addData[element]})
                else:
                    data = json.load(row[element])
                    data.append({"value": addData[element]})
                    addData[element] = json.dumps(data)
            self.insert(table, searchData, addData)
        except exceptions.DatabaseException as e:
            raise e

    def insert(self, table, searchData, insertData):
        """
        This method is used to change the value of columns in a table. Only use for non list columns.
        :param table: Table Enum with the table the new entry should be added to
        :param searchData: The data which should be used to search the row to manipulate
        :param insertData: The data which should be added in form of a dict with the key being the column name
        and the value being the value to add
        :return: None
        :raise MoreThanOneRowFoundException: If there are multiple rows fitting the search criteria
        :raise ColumnAListException: If the key of insertData is represented as a list in the table
        """
        try:
            self._containsListData(table, insertData)
            self.findOne(table, searchData)
            executionText = f"UPDATE {table.value} SET "
            for key in insertData:
                executionText = executionText + f" {key} = ? AND"
            executionText = executionText[:-3] + "WHERE "
            for key in searchData:
                executionText = executionText + f" {key} = ? AND"
            executionText = executionText[:-3]
            with self.conn:
                self.c.execute(executionText, tuple([insertData[key] for key in insertData]) + tuple(
                    [searchData[key] for key in searchData]))
        except exceptions.DatabaseException as e:
            raise e

    def _checkForListData(self, table, data):
        """
        This method checks if there is any data in "data" is not a list.
        :param table: Table Enum with the table the new entry should be added to
        :param data: The data that should be checked
        :return: None
        :raise ColumnNotAListException: If any key of data is not represented as a list in the table
        """
        for key in data:
            if self.typeCheckMap[table][key] != "list":
                raise exceptions.ColumnNotAListException(key)

    def _containsListData(self, table, data):
        """
        This method checks if there is any data in "data" that is a list.
        :param table: Table Enum with the table the new entry should be added to
        :param data: The data that should be checked
        :return: None
        :raise ColumnAListException: If any key of data is represented as a list in the table
        """
        for key in data:
            if self.typeCheckMap[table][key] == "list":
                raise exceptions.ColumnAListException(key)

    def findOne(self, table, searchData):
        """
        This method queries the database with the searchData parameter. It should be used if the query result should
        only be one row.
        :param table: Table Enum with the table the new entry should be added to
        :param searchData: The data which should be used to search the row
        :return: The row matching the searchData as a dict
        :raise MoreThanOneRowFoundException: If there are more than one row found with the help of the searchData parameter
        """
        temp = self.find(table, searchData)
        if len(temp) == 1:
            return temp
        raise exceptions.MoreThanOneRowFoundException(searchData)

    def find(self, table, searchData):
        """
        This method queries the database with the searchData parameter and returns all rows found that fit.
        :param table: Table Enum with the table the new entry should be added to
        :param searchData: The data which should be used to search the rows
        :return: All rows matching the searchData as a list of dict
        """
        executionText = f"SELECT * FROM {table.value} WHERE"
        for key in searchData:
            executionText = executionText + f" {key} = :{key} AND"
        with self.conn:
            self.c.execute(executionText[:-3], searchData)
        return self.c.fetchall()

    def createNewDatabase(self):
        """
        This function creates a new database in memory for debugging purposes
        :return: None
        """

        logging.info("Creating new Database in memory")
        self.conn = sl.connect(':memory:')
        self.c = self.conn.cursor()
        self.c.execute("""CREATE TABLE AUTHENTICATION (
            username TEXT,
            password TEXT 
            )""")
        self.c.execute("""CREATE TABLE USER (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-'
                              || lower(hex(randomblob(2))) || '-'
                              || '4' || substr(lower(hex(randomblob(2))),2) || '-'
                              || 'a' || substr(lower(hex(randomblob(2))),2) || '-'
                              || lower(hex(randomblob(6)))),
              rank integer,
              bookmarks TEXT,
              upvotedFiles TEXT
        )""")
        self.c.execute("""CREATE TABLE FILES (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-'
              || lower(hex(randomblob(2))) || '-'
              || '4' || substr(lower(hex(randomblob(2))),2) || '-'
              || 'a' || substr(lower(hex(randomblob(2))),2) || '-'
              || lower(hex(randomblob(6)))),
              path TEXT,
              title TEXT,
              author TEXT,
              semester integer,
              year integer,
              department TEXT,
              upvotes integer
        )""")
