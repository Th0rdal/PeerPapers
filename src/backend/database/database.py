import sqlite3
import sqlite3 as sl
import logging
import json
import uuid

from .Table import Table
from . import exceptions
from util import getTotalPath, createUUID, calculateRankString


class DatabaseAccessObject:
    """
    This class is responsible for providing an interface on which to access the database on. All methods with a _ in front
    are to be handled as private and should not be called outside of this class! Searching by columns that save data as a list
    is possible, but highly recommended not to. Especially when the list is empty, because python sometimes puts an empty string
    in a dict in extra '' do differentiate it from an empty dict, but it is not consistent in doing so.
    """
    topRanks = []
    averageRank = 100
    rankDict = {
        "bronze": 0,
        "silver": 0,
        "gold": 0,
        "platin": 0
    }
    rankDivision = {
        "bronze": 30,
        "silver": 60,
        "gold": 90,
        "platin": 100
    }
    rankMultiplier = {
        "upvote": 1,
        "download": 0.5
    }
    typeCheckMap = {Table.AUTHENTICATION: {"username": "str", "password": "str"},
                    Table.USER: {"id": "id", "username": "str", "rank": "int", "bookmarks": "list",
                                 "upvotedFiles": "list"},
                    Table.FILES: {"id": "id", "title": "str", "author": "str", "semester": "int",
                                  "year": "int",
                                  "department": "str", "upvotes": "int"}}

    def __init__(self, testing=False):
        logging.info("Initializing DatabaseAccessObject")
        if testing:
            logging.info("Creating test database in memory")
            self.__createNewDatabase(":memory:")
            return
        # should connect to database here
        logging.info("Connecting to database")
        try:
            self.conn = sl.connect(f'file:{getTotalPath("resources/database/database.db")}?mode=rw', uri=True)
            self.c = self.conn.cursor()
        except sqlite3.OperationalError as e:
            self.__createNewDatabase(getTotalPath("resources/database/database.db"))

    def printTable(self, table):
        print(self.getTable(table))

    def getTable(self, table):
        """
        This method prints the whole table and returns it. Use for debugging purposes!
        :param table: Table Enum with the table that should be printed
        :return: Whole table as list of tuples containing the values of each row
        """
        with self.conn:
            self.c.execute(f"SELECT * FROM {table.value}")
            result = self.c.fetchall()
        return result

    def newEntry(self, table, data):
        """
        This method is responsible for creating a new entry into a table.
        :param table: Table Enum with the table the new entry should be added to
        :param data: The data of all columns of the table
        :return: None
        """
        logging.info(f'Adding a new entry "{data}" to the database {table}')
        if (result := self.__hasAllFields(self.typeCheckMap[table], data)) is not None:
            raise exceptions.FieldMissingException(result)
        if listColumns := self.__getAllListColumns(table):
            for column in listColumns:
                data[column] = self.__addDataToList("", data[column])
        if table == Table.AUTHENTICATION:
            executionText = "INSERT INTO AUTHENTICATION VALUES (:username, :password)"
        elif table == Table.USER:
            data["id"] = createUUID()
            executionText = "INSERT INTO USER VALUES (:id, :username, :rank, :bookmarks, :upvotedFiles)"
        elif table == Table.FILES:
            if "id" not in data:
                data["id"] = createUUID()
            executionText = "INSERT INTO FILES VALUES (:id, :title, :author, :semester, :year, :department, :upvotes)"
        with self.conn:
            self.c.execute(executionText, data)

    def deleteFromList(self, table, searchData, deleteData):
        """
        This method deletes data from a list column of a table. It can only delete from lists!
        :param table: Table Enum with the table that should be manipulated
        :param searchData: The data which should be used to search the row to manipulate
        :param deleteData: The data which should be deleted in form of a dict with the key being the column name
        and the value being the value to delete
        :return: None
        :raise NoRowFoundException: If there is no row fitting the criteria given
        :raise MoreThanOneRowFoundException: If there are multiple rows fitting the search criteria
        :raise ColumnNotAListException: If the key of addData is not represented as a list in the table
        """
        try:
            self.__checkIfDataIsList(table, deleteData, True)
            row = self.findOne(table, searchData)
            newInsertData = {}
            for element in deleteData:
                if (result := self.__removeDataFromList(row[element], deleteData[element])) is not None:
                    newInsertData[element] = result
            if newInsertData:
                self.__insert(table, searchData, newInsertData)
        except exceptions.DatabaseException as e:
            raise e

    def addToList(self, table, searchData, addData):
        """
        This method adds data to a list column of a table. It can only add to lists!
        :param table: Table Enum with the table that should be manipulated
        :param searchData: The data which should be used to search the row to manipulate
        :param addData: The data which should be added in form of a dict with the key being the column name
        and the value being the value to add
        :return: None
        :raise NoRowFoundException: If there is no row fitting the criteria given
        :raise MoreThanOneRowFoundException: If there are multiple rows fitting the search criteria
        :raise ColumnNotAListException: If the key of addData is not represented as a list in the table
        """
        try:
            self.__checkIfDataIsList(table, addData, True)
            row = self.findOne(table, searchData)
            for element in addData:
                addData[element] = self.__addDataToList(row[element], addData[element])
            self.__insert(table, searchData, addData)
        except exceptions.DatabaseException as e:
            raise e

    def update(self, table, searchData, insertData):
        """
        This method is used to update the value of columns in the table. Only use on non list columns.
        :param table: Table Enum with the table that should be manipulated
        :param searchData: The data which should be used to search the row to manipulate
        :param insertData: The data which should be added in form of a dict with the key being the column name
        and the value being the value to add
        :return: None
        :raise NoRowFoundException: If there is no row fitting the criteria given
        :raise MoreThanOneRowFoundException: If there are multiple rows fitting the search criteria
        :raise ColumnAListException: If the key of insertData is represented as a list in the table
        """
        try:
            self.__checkIfDataIsList(table, insertData, False)
            row = self.findOne(table, searchData)
            for element in insertData:
                if insertData[element].startswith("+"):
                    insertData[element] = row[element] + int(insertData[element][1:])
                elif insertData[element].startswith("-"):
                    insertData[element] = row[element] - int(insertData[element][1:])
            print(insertData)
            self.__insert(table, searchData, insertData)
        except exceptions.DatabaseException as e:
            raise e

    def findOne(self, table, searchData):
        """
        This method queries the database with the searchData parameter. It should be used if the query result should
        only be one row.
        :param table: Table Enum with the table that should be manipulated
        :param searchData: The data which should be used to search the row
        :return: The row matching the searchData as a dict
        :raise NoRowFoundException: If there is no row fitting the criteria given
        :raise MoreThanOneRowFoundException: If there are more than one row found with the help of the searchData parameter
        """
        temp = self.find(table, searchData)
        if len(temp) == 1:
            return temp[0]
        elif len(temp) == 0:
            raise exceptions.NoRowFoundException(searchData)
        raise exceptions.MoreThanOneRowFoundException(searchData)

    def find(self, table, searchData):
        """
        This method queries the database with the searchData parameter and returns all rows found that fit.
        :param table: Table Enum with the table that should be manipulated
        :param searchData: The data which should be used to search the rows
        :return: All rows matching the searchData as a list of dict
        """
        logging.info(f"Querying database for rows that fit the search criteria {searchData}")
        executionText = f"SELECT * FROM {table.value} WHERE"
        for key in searchData:
            if self.typeCheckMap[table][key] == "str":
                executionText = executionText + f" {key} LIKE :{key} AND"
            else:
                executionText = executionText + f" {key} = :{key} AND"
            if searchData[key] == '' or searchData[key] == []:
                searchData[key] = '""'
        with self.conn:
            self.c.execute(executionText[:-3], searchData)
        rows = self.c.fetchall()
        result = []
        for row in rows:
            dict = {}
            for type, element in zip(self.typeCheckMap[table], row):
                if self.typeCheckMap[table][type] == "list":
                    if element == '""':
                        dict[type] = []
                        continue
                    tempData = json.loads(element)
                    dict[type] = [key["value"] for key in tempData]
                    continue
                dict[type] = element
            result.append(dict)
        return result

    def calculateRankValues(self):
        """
        Calculates average, userNumber and rankDivision numbers.
        :return: None
        """

        self.c.execute("SELECT SUM(rank) FROM USER")
        self.averageRank = self.c.fetchone()[0]

        self.c.execute("SELECT COUNT(*) FROM USER")
        userNumber = self.c.fetchone()[0]

        # get rank values for each division
        for key in self.rankDivision:
            temp = (userNumber / 100) * self.rankDivision[key]
            self.c.execute(f"SELECT * FROM USER ORDER BY rank ASC LIMIT 1 OFFSET {temp}")
            self.rankDict[key] = self.c.fetchone()[0]["rank"]

    def getTopRanks(self, amount):
        """
        Returns a list of the top x ranked users.
        :return: List of object
        """
        self.c.execute(f"SELECT * FROM USER ORDER BY rank DESC LIMIT {amount}")
        temp = self.c.fetchall()
        tempDict = {}
        self.topRanks = []
        for key in temp:
            tempDict["rankPoints"] = temp[key]["rank"]
            tempDict[key] = tempDict[key]["username"]
            tempDict["rank"] = calculateRankString(tempDict["rank"], self.rankDict)
            self.topRanks.append = tempDict

    def __createNewDatabase(self, path):
        """
        This function creates a new database in memory for debugging purposes
        :return: None
        """

        logging.info("Creating new Database")
        self.conn = sl.connect(path)
        self.c = self.conn.cursor()
        self.c.execute("""CREATE TABLE AUTHENTICATION (
            username TEXT,
            password TEXT 
            )""")
        self.c.execute("""CREATE TABLE USER (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || 
                                  lower(hex(randomblob(2))) || 
                                  '4' || substr(lower(hex(randomblob(2))),2) || 
                                  'a' || substr(lower(hex(randomblob(2))),2) || 
                                  lower(hex(randomblob(6)))),
              username TEXT,
              rank integer,
              bookmarks TEXT,
              upvotedFiles TEXT
        )""")
        self.c.execute("""CREATE TABLE FILES (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || 
                                  lower(hex(randomblob(2))) || 
                                  '4' || substr(lower(hex(randomblob(2))),2) || 
                                  'a' || substr(lower(hex(randomblob(2))),2) || 
                                  lower(hex(randomblob(6)))),
              title TEXT,
              author TEXT,
              semester integer,
              year integer,
              department TEXT,
              upvotes integer
        )""")

    # private methods

    def __addDataToList(self, originalData, data):
        """
        This method appends data to the already saved data in the list.
        :param originalData: The data already in the column of the database as str
        :param data: The data that needs to be added as str
        :return: The data as str in a format ready to save in the database
        """
        if originalData == "" or originalData == '""' or originalData == []:
            if data == "" or data == []:
                return json.dumps("")
            else:
                return json.dumps([{"value": data}])
        else:
            originalData.append(data)
            newData = []
            for d in originalData:
                newData.append({"value": d})
            return json.dumps(newData)

    def __removeDataFromList(self, originalData, data):
        """
        This method removes data from the saved data in the list
        :param originalData: The data already in the column of the database as str
        :param data: The data that needs to be deleted as str
        :return: The data as str in a format ready to save in the database. If the element is not in the list, it just
        returns the list as is
        """
        if originalData == "" or originalData == '""' or originalData == []:
            return None
        deleteIndex = -1
        for index, element in enumerate(originalData):
            if element == data:
                deleteIndex = index
                break
        if deleteIndex == -1:
            return None
        originalData.pop(deleteIndex)
        newData = []
        for d in originalData:
            newData.append({"value": d})
        return json.dumps(newData)

    def __hasAllFields(self, tableType, data):
        """
        This method checks if all the expected keys are present in the data
        :param tableType: An entry of typeCheckMap that represents the table that is currently worked on
        :param data: The data to check
        :return: The field that is missing/too much or None if all fields are accounted for
        """
        for field in tableType:
            if field not in data and tableType[field] != "id":
                return field
        return None

    def __insert(self, table, searchData, insertData):
        """
        This method is used to change the value of columns in a table.
        :param table: Table Enum with the table that should be manipulated
        :param searchData: The data which should be used to search the row to manipulate
        :param insertData: The data which should be added in form of a dict with the key being the column name
        and the value being the value to add
        :return: None
        """
        logging.info(f"Inserting {insertData} into table {table.value} rows fitting the criteria {searchData}")
        executionText = f"UPDATE {table.value} SET "
        for key in insertData:
            executionText = executionText + f" {key} = ?, "
        executionText = executionText[:-2] + " WHERE "
        for key in searchData:
            executionText = executionText + f" {key} = ? AND"
        executionText = executionText[:-3]
        with self.conn:
            self.c.execute(executionText, tuple([insertData[key] for key in insertData]) + tuple(
                [searchData[key] for key in searchData]))

    def __checkIfDataIsList(self, table, data, shouldBeList):
        """
        This method checks if there is any column in "data" that is not saved as a list in the database.
        :param table: Table Enum with the table that should be manipulated
        :param data: The data that should be checked
        :param shouldBeList: boolean that is True if the data is saved as list in the database and False if it is not
        :return: None
        :raise ColumnNotAListException: If any key of data is not represented as a list in the table
        :raise ColumnAListException: If any key of data is represented as a list in the table
        """
        for key in data:
            if self.typeCheckMap[table][key] != "list" and shouldBeList:
                raise exceptions.ColumnNotAListException(key)
            if self.typeCheckMap[table][key] == "list" and not shouldBeList:
                raise exceptions.ColumnAListException(key)

    def __getAllListColumns(self, table):
        """
        This method returns all columns of a table that save data in a list.
        :param table:
        :return: A list with all columns that save a list in the database
        """
        listColumns = []
        for key in self.typeCheckMap[table]:
            if self.typeCheckMap[table][key] == "list":
                listColumns.append(key)
        return listColumns
