import copy
import unittest

from src.database import exceptions
from src.database.Table import Table
from src.database.database import DatabaseAccessObject


class DatabaseTest(unittest.TestCase):

    def setUp(self):
        self.database = DatabaseAccessObject(testing=True)
        self.newEntryData = {Table.AUTHENTICATION: {"username": "admin", "password": "testpassword"},
                             Table.USER: {"id": "007", "username": "testUser", "rank": 4, "bookmarks": [],
                                          "upvotedFiles": []},
                             Table.FILES: {"id": "007", "path": "test/path", "title": "MY_TEST_TRY", "author": "admin",
                                           "semester": 3,
                                           "year": 2025,
                                           "department": "CSDC", "upvotes": 0}}

        self.expectedData = {Table.AUTHENTICATION: {"username": "admin", "password": "testpassword"},
                             Table.USER: {"username": "testUser", "rank": 4, "bookmarks": [],
                                          "upvotedFiles": []},
                             Table.FILES: {"path": "test/path", "title": "MY_TEST_TRY", "author": "admin",
                                           "semester": 3,
                                           "year": 2025,
                                           "department": "CSDC", "upvotes": 0}}
        self.expectedRawData = {Table.AUTHENTICATION: {"username": "admin", "password": "testpassword"},
                             Table.USER: {"username": "testUser", "rank": 4, "bookmarks": '""',
                                          "upvotedFiles": '""'},
                             Table.FILES: {"path": "test/path", "title": "MY_TEST_TRY", "author": "admin",
                                           "semester": 3,
                                           "year": 2025,
                                           "department": "CSDC", "upvotes": 0}}

    def test_new_entry(self):
        # check if entry can be added to table
        for table in self.newEntryData:
            self.database.newEntry(table, self.newEntryData[table])
            result = self.database.getTable(table)
            if "id" in self.newEntryData[table]:
                result = result[0][1:]
            else:
                result = result[0]
            expected = tuple([self.expectedRawData[table][key] for key in self.expectedRawData[table]])
            self.assertEqual(result, expected)

        # check if field is missing
        with self.assertRaises(exceptions.FieldMissingException) as context:
            self.database.newEntry(Table.AUTHENTICATION, {"username": "admin"})
        self.assertEqual(str(context.exception), 'The data to create a new entry is missing the "password" field')

    def test_add_to_list(self):
        # preparation
        entryData = self.newEntryData[Table.USER]
        self.database.newEntry(Table.USER, entryData)
        del entryData["bookmarks"]
        self.database.addToList(Table.USER, entryData, {"bookmarks": "testBookmark"})
        expected1 = ("testUser", 4, '[{"value": "testBookmark"}]', '""')
        expected2 = ("testUser", 4, '[{"value": "testBookmark"}, {"value": "testBookmark2"}]', '""')
        expected3 = ("testUser", 4,
                      '[{"value": "testBookmark"}, {"value": "testBookmark2"}, {"value": "anotherBookmark"}]',
                      '[{"value": "testFile"}]')

        # adding to empty list
        result = self.database.getTable(Table.USER)
        result = result[0][1:]
        self.assertEqual(result, expected1, "Error in adding to empty list")

        # adding to already populated list
        self.database.addToList(Table.USER, entryData, {"bookmarks": "testBookmark2"})
        result = self.database.getTable(Table.USER)
        result = result[0][1:]
        self.assertEqual(result, expected2, "Error in adding to already populated list")

        # adding to two list at the same time
        self.database.addToList(Table.USER, entryData, {"bookmarks": "anotherBookmark", "upvotedFiles": "testFile"})
        result = self.database.getTable(Table.USER)
        result = result[0][1:]
        self.assertEqual(result, expected3, "Error in adding to two lists at the same time")

    def test_delete_from_list(self):
        # preparation
        entryData = self.newEntryData[Table.USER]
        self.database.newEntry(Table.USER, entryData)
        del entryData["bookmarks"]
        expected1 = self.database.getTable(Table.USER)[0][1:]
        expected2 = ("testUser", 4,
                      '[{"value": "testBookmark"}, {"value": "2testBookmark"}, {"value": '
                      '"4Bookmarktest"}, {"value": "bd5"}]',
                      '""')

        # deleting value from empty list
        self.database.deleteFromList(Table.USER, entryData, {"bookmarks": "testBookmark"})
        result = self.database.getTable(Table.USER)
        result = result[0][1:]
        self.assertEqual(result, expected1, "Error in trying to delete value from empty list")

        # deleting 1 existing value from already populated list
        self.database.addToList(Table.USER, entryData, {"bookmarks": "testBookmark"})
        self.database.addToList(Table.USER, entryData, {"bookmarks": "2testBookmark"})
        self.database.addToList(Table.USER, entryData, {"bookmarks": "3Bookmarktest"})
        self.database.addToList(Table.USER, entryData, {"bookmarks": "4Bookmarktest"})
        self.database.addToList(Table.USER, entryData, {"bookmarks": "bd5"})

        self.database.deleteFromList(Table.USER, entryData, {"bookmarks": "3Bookmarktest"})
        result = self.database.getTable(Table.USER)
        result = result[0][1:]
        self.assertEqual(result, expected2, "Error in deleting existing value from list")

        # delete non existing value from already populated list
        self.database.deleteFromList(Table.USER, entryData, {"bookmarks": "asdf"})
        result = self.database.getTable(Table.USER)
        result = result[0][1:]
        self.assertEqual(result, expected2, "Error in trying to delete non existing value from list.")


    def test_update(self):
        # preparation
        entryData = self.newEntryData[Table.USER]
        self.database.newEntry(Table.USER, entryData)
        del entryData["username"]
        expected1 = ("admin", 4, '""', '""')
        expected2 = ("admin", 10, '""', '""')

        # update string
        self.database.update(Table.USER, entryData, {"username": "admin"})
        result = self.database.getTable(Table.USER)
        result = result[0][1:]
        self.assertEqual(result, expected1, "Error in trying to update a string in a table")

        # update number
        self.database.update(Table.USER, entryData, {"rank": 10})
        result = self.database.getTable(Table.USER)
        result = result[0][1:]
        self.assertEqual(result, expected2, "Error in trying to update an integer in a table")

        # trying to update a column saving a list
        del entryData["rank"]
        with self.assertRaises(exceptions.ColumnAListException) as context:
            self.database.update(Table.USER, entryData, {"bookmarks": "testmarks"})
        self.assertEqual(str(context.exception),
                         'The column "bookmarks" cannot be changed with this method, because it is a list. Try using a list manipulation method')

    def test_findOne(self):
        # check if entry data is correctly found with one entry in the table
        for table in self.newEntryData:
            data = copy.deepcopy(self.newEntryData[table])
            self.database.newEntry(table, copy.deepcopy(data))
            if "id" in self.newEntryData[table]:
                del data["id"]
            result = self.database.findOne(table, copy.deepcopy(data))
            if "id" in self.newEntryData[table]:
                del result["id"]
            self.assertEqual(result, self.expectedData[table],
                             "Error in checking if a row can be found when there is one row in the table")

        # checking if entry data is correctly found with multiple entries in the table
        for table in self.newEntryData:
            data = copy.deepcopy(self.newEntryData[table])
            if "id" in self.newEntryData[table]:
                del data["id"]
            expected = self.expectedData[table]
            for _ in range(10):
                for key in data:
                    data[key] = data[key] + "k"
                    break
                self.database.newEntry(table, copy.deepcopy(data))
            result = self.database.findOne(table, copy.deepcopy(expected))
            if "id" in self.newEntryData[table]:
                del result["id"]
            self.assertEqual(result, expected,
                             "Error in checking if a row can be found when there are multiple rows in the table")

        # checking if exception when multiple rows found
        data = copy.deepcopy(self.newEntryData[Table.AUTHENTICATION])
        self.database.newEntry(Table.AUTHENTICATION, data)
        searchData = {"username": "admin"}
        with self.assertRaises(exceptions.MoreThanOneRowFoundException) as context:
            self.database.findOne(Table.AUTHENTICATION, searchData)
        self.assertEqual(str(context.exception),
                         f'When calling "findOne", there were more than 1 row found with the criteria: "{searchData}"')

        # checking if exception when no row found
        searchData = {"username": "definetlyNotAUsername"}
        with self.assertRaises(exceptions.NoRowFoundException) as context:
            self.database.findOne(Table.AUTHENTICATION, searchData)
        self.assertEqual(str(context.exception),
                         f'When calling "findOne", there was no row found when with the criteria: "{searchData}"')

    def test_find(self):
        expected = []
        data = copy.deepcopy(self.newEntryData[Table.USER])
        del data["id"]
        for i in range(10):
            data["rank"] = i
            self.database.newEntry(Table.USER, copy.deepcopy(data))
            expected.append(copy.deepcopy(data))
        result = self.database.find(Table.USER, {"username": "testUser"})

        for resultElement in result:
            del resultElement["id"]
        self.assertEqual(result, expected)

    def test_checkIfDataIsList(self):
        # preparation
        dataNoList = {"username": "admin"}
        dataList = {"bookmarks": "test"}
        expected = None

        # checking for list when data is a list
        result = self.database._checkIfDataIsList(Table.USER, dataList, True)
        self.assertEqual(result, expected)

        # checking for non list when data is not a list
        result = self.database._checkIfDataIsList(Table.USER, dataNoList, False)
        self.assertEqual(result, expected)

        # checkin for list when data is not a list
        with self.assertRaises(exceptions.ColumnNotAListException) as context:
            self.database._checkIfDataIsList(Table.USER, dataNoList, True)
        self.assertEqual(str(context.exception), f'The column "username" does not save lists')

        # checkin for non list when data is a list
        with self.assertRaises(exceptions.ColumnAListException) as context:
            self.database._checkIfDataIsList(Table.USER, dataList, False)
        self.assertEqual(str(context.exception), f'The column "bookmarks" cannot be changed with this method, because it is a list. Try using a '
                         f'list manipulation method')

if __name__ == "__main__":
    unittest.main()
