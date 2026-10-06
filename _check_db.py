import sqlite3
conn = sqlite3.connect('data/cyrux.sqlite')
rows = conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
print([r[0] for r in rows])
conn.close()
