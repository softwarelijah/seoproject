import sqlite3

def show_table(table_name):
    conn = sqlite3.connect('food_watste_tracker.db')
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()
    print(f"\nContents of {table_name}:")
    for row in rows:
        print(row)
    conn.close()

if __name__ == "__main__":
    show_table('users')
    show_table('analysis_logs')
