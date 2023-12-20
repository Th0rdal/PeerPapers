class DatabaseException(Exception):
    def __init__(self, message):
        super().__init__(message)


class MoreThanOneRowFoundException(DatabaseException):
    def __init__(self, data):
        super().__init__(f'There were more than 1 row found when calling "findOne" with the parameter: {data}')


class FieldMissingException(DatabaseException):
    def __init__(self, field):
        super().__init__(f'The data to create a new entry is missing the "{field}" field')


class ColumnNotAListException(DatabaseException):
    def __init__(self, column):
        super().__init__(f'The column "{column}" does not save lists')


class ColumnAListException(DatabaseException):
    def __init__(self, column):
        super().__init__(f'The column {column} cannot be changed with this method, because it is a list. Try using a '
                         f'list manipulation method')
