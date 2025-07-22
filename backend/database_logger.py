import sqlite3

connection = sqlite3.connect('food_watste_tracker.db')
cursor = connection.cursor()

# users table
cursor.execute('''CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'user', 'guest'))
)''')

# analysis_logs table
cursor.execute('''CREATE TABLE IF NOT EXISTS analysis_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    image_path TEXT NOT NULL,
    class_name TEXT NOT NULL,
    confidence_score REAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
)''')

connection.commit()

def log_result(user_id, class_name, confidence_score, image_path):
    cursor.execute('''INSERT INTO analysis_logs (user_id, image_path, class_name, confidence_score) VALUES (?, ?, ?, ?)''',
                   (user_id, image_path, class_name, confidence_score))
    connection.commit()

def log_user(username, email, password, role='user'):
    cursor.execute(
        '''INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)''',
        (username, email, password, role)
    )
    connection.commit()
    return cursor.lastrowid