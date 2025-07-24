import sqlite3

conn = sqlite3.connect('food_waste_tracker.db')
cursor = conn.cursor()

cursor.execute('DROP TABLE IF EXISTS analysis_logs')
cursor.execute('DROP TABLE IF EXISTS users')

conn.commit()
conn.close()
print("All tables (users, analysis_logs) have been deleted from the database.")
