import sqlite3

def get_user_credentials():
    conn = sqlite3.connect('food_waste_tracker.db')
    cursor = conn.cursor()
    # Fetch all user credentials
    cursor.execute("SELECT email, password, id FROM users")
    result = cursor.fetchall()

    # Close the connection and return the result
    conn.close()
    return result

def show_table(table_name, user_id=None, role='guest'):
    conn = sqlite3.connect('food_waste_tracker.db')
    cursor = conn.cursor()

     # Check if the table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table_name,))
    if cursor.fetchone() is None:
        print(f"Table '{table_name}' does not exist.")
        conn.close()
        return


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
