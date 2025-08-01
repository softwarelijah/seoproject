import sqlite3
from database_logger import log_user, create_tables

def add_user(name,email, password, role = 'admin'):
    create_tables()
    log_user(name, email, password, role)

if __name__ == "__main__":
    add_user("Tobenna Nwosu", "tobennanwosu10@gmail.com", "1234easypeasy", role='admin')