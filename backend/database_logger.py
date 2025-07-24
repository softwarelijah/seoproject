import sqlite3

def create_tables():
    conn = sqlite3.connect('food_waste_tracker.db')
    cur = conn.cursor()
    
    cur.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin', 'user', 'guest'))
    )''')

    cur.execute('''CREATE TABLE IF NOT EXISTS analysis_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        image_path TEXT NOT NULL,
        class_name TEXT NOT NULL,
        confidence_score REAL NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )''')

    conn.commit()
    conn.close()


def log_result(user_id, class_name, confidence_score, image_path):
    conn = sqlite3.connect('food_waste_tracker.db')
    cur = conn.cursor()
    cur.execute(
        '''INSERT INTO analysis_logs (user_id, image_path, class_name, confidence_score)
           VALUES (?, ?, ?, ?)''',
        (user_id, image_path, class_name, confidence_score)
    )
    conn.commit()
    conn.close()

def log_user(username, email, password, role='user'):
    conn = sqlite3.connect('food_waste_tracker.db')
    cur = conn.cursor()
    cur.execute(
        '''INSERT INTO users (username, email, password, role)
           VALUES (?, ?, ?, ?)''',
        (username, email, password, role)
    )
    conn.commit()
    user_id = cur.lastrowid
    conn.close()
    return user_id

