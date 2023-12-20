from enum import Enum


class Table(Enum):
    """
    THis enum represents all available tables in the database
    """
    AUTHENTICATION = "AUTHENTICATION"
    USER = "USER"
    FILES = "FILES"
