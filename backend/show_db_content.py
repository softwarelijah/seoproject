import sqlite3


def show_table(table_name, user_id=None, role='guest'):
    conn = sqlite3.connect('food_watste_tracker.db')
    cursor = conn.cursor()

    # Admin can view all tables
    if role == 'admin':
        cursor.execute(f"SELECT * FROM {table_name}")
    # User can only view their own logs
    elif role == 'user':
        # however, users can only view their own analysis logs, not the users table
        if table_name == 'users':
            print("Permission denied: users cannot view the users table.")
            conn.close()
            return
        elif table_name == 'analysis_logs':
            cursor.execute("SELECT * FROM analysis_logs WHERE user_id = ?", (user_id,))
    # Guest cannot view any tables
    elif role == 'guest':
        print("Permission denied: guests cannot view any tables.")
        conn.close()
        return
    # Unknown role (not admin, user, or guest)
    else:
        print("Unknown role.")
        conn.close()
        return
    rows = cursor.fetchall()
    print(f"\nContents of {table_name}:")
    for row in rows:
        print(row)
    conn.close()

if __name__ == "__main__":
    # Example for me (TOBY - admin)
    show_table('users', role='admin')
    show_table('analysis_logs', role='admin')
