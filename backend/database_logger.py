import sqlite3

def create_tables():
    conn = sqlite3.connect('food_waste_tracker.db')
    cur = conn.cursor()
    
    cur.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
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

def log_user(name, email, password, role='user'):
    conn = sqlite3.connect('food_waste_tracker.db')
    cur = conn.cursor()
    cur.execute(
        '''INSERT INTO users (name, email, password, role)
           VALUES (?, ?, ?, ?)''',
        (name, email, password, role)
    )
    conn.commit()
    user_id = cur.lastrowid
    conn.close()
    return user_id


def get_analysis_history(user_id=None, role='guest', limit=10):
    """
    Get analysis history for a user or all users (for admin).
    """
    conn = sqlite3.connect('food_waste_tracker.db')
    cur = conn.cursor()
    
    if role == 'admin':
        # Admin can see all history
        cur.execute('''
            SELECT id, user_id, timestamp, image_path, class_name, confidence_score
            FROM analysis_logs
            ORDER BY timestamp DESC
            LIMIT ?
        ''', (limit,))
    elif role == 'user' and user_id:
        # User can only see their own history
        cur.execute('''
            SELECT id, user_id, timestamp, image_path, class_name, confidence_score
            FROM analysis_logs
            WHERE user_id = ?
            ORDER BY timestamp DESC
            LIMIT ?
        ''', (user_id, limit))
    else:
        # Guest or no user_id - return empty list
        conn.close()
        return []
    
    results = cur.fetchall()
    conn.close()
    return results


def get_user_stats(user_id=None, role='guest'):
    """
    Get user statistics for dashboard.
    """
    conn = sqlite3.connect('food_waste_tracker.db')
    cur = conn.cursor()
    
    if role == 'admin':
        # Admin gets overall stats
        cur.execute('''
            SELECT 
                COUNT(*) as total_scans,
                COUNT(CASE WHEN class_name = 'organic' THEN 1 END) as organic_count,
                COUNT(CASE WHEN class_name = 'recycle' THEN 1 END) as recycle_count,
                COUNT(CASE WHEN class_name = 'trash' THEN 1 END) as trash_count,
                AVG(confidence_score) as avg_confidence
            FROM analysis_logs
        ''')
    elif role == 'user' and user_id:
        # User gets their own stats
        cur.execute('''
            SELECT 
                COUNT(*) as total_scans,
                COUNT(CASE WHEN class_name = 'organic' THEN 1 END) as organic_count,
                COUNT(CASE WHEN class_name = 'recycle' THEN 1 END) as recycle_count,
                COUNT(CASE WHEN class_name = 'trash' THEN 1 END) as trash_count,
                AVG(confidence_score) as avg_confidence
            FROM analysis_logs
            WHERE user_id = ?
        ''', (user_id,))
    else:
        # Guest gets no stats
        conn.close()
        return {
            'total_scans': 0,
            'organic_count': 0,
            'recycle_count': 0,
            'trash_count': 0,
            'avg_confidence': 0
        }
    
    result = cur.fetchone()
    conn.close()
    
    if result:
        return {
            'total_scans': result[0],
            'organic_count': result[1],
            'recycle_count': result[2],
            'trash_count': result[3],
            'avg_confidence': round(result[4], 2) if result[4] else 0
        }
    else:
        return {
            'total_scans': 0,
            'organic_count': 0,
            'recycle_count': 0,
            'trash_count': 0,
            'avg_confidence': 0
        }


def get_waste_categories_stats(user_id=None, role='guest'):
    """
    Get waste categories statistics for insights.
    """
    conn = sqlite3.connect('food_waste_tracker.db')
    cur = conn.cursor()
    
    if role == 'admin':
        cur.execute('''
            SELECT 
                class_name,
                COUNT(*) as count,
                ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM analysis_logs), 2) as percentage
            FROM analysis_logs
            GROUP BY class_name
            ORDER BY count DESC
        ''')
    elif role == 'user' and user_id:
        cur.execute('''
            SELECT 
                class_name,
                COUNT(*) as count,
                ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM analysis_logs WHERE user_id = ?), 2) as percentage
            FROM analysis_logs
            WHERE user_id = ?
            GROUP BY class_name
            ORDER BY count DESC
        ''', (user_id, user_id))
    else:
        conn.close()
        return []
    
    results = cur.fetchall()
    conn.close()
    
    return [
        {
            'name': row[0],
            'count': row[1],
            'percentage': row[2]
        }
        for row in results
    ]

