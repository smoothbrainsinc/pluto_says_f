import sqlite3
import json

# Connect to the SQLite database (creates it if it doesn't exist)
conn = sqlite3.connect('clash_data.db')
cursor = conn.cursor()

# Create the table (if it doesn't exist)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT,  -- "troop", "building", or "trap"
        type TEXT,      -- e.g., "Air Sweeper", "Electro Dragon"
        level INTEGER,
        key TEXT,       -- e.g., "Hitpoints", "Damage per Second"
        value TEXT      -- e.g., "750", "200"
    )
''')

# Function to insert data into the table
def insert_data(category, type_name, level, data):
    for key, value in data.items():
        cursor.execute('''
            INSERT INTO data (category, type, level, key, value)
            VALUES (?, ?, ?, ?, ?)
        ''', (category, type_name, level, key, str(value)))

# Load and process troop_stats.json
with open('troop_stats.json') as f:
    troops_data = json.load(f)
    for troop_type, items in troops_data.items():
        for item in items:
            insert_data('troop', troop_type, item.get("Level", 1), item)

# Load and process building_stats.json
with open('building_stats.json') as f:
    buildings_data = json.load(f)
    for building_type, items in buildings_data.items():
        for item in items:
            insert_data('building', building_type, item.get("Level", 1), item)

# Load and process trap_stats.json
with open('trap_stats.json') as f:
    traps_data = json.load(f)
    for trap_type, items in traps_data.items():
        for item in items:
            insert_data('trap', trap_type, item.get("Level", 1), item)

# Commit changes and close the connection
conn.commit()
conn.close()

print("Data imported successfully!")
