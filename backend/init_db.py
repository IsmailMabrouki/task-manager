# init_db.py
from app import create_app, db
import os

app = create_app()

# Check if the database file exists, if not, create the tables
if not os.path.exists(os.path.join(os.getcwd(), 'tasks.db')):
    with app.app_context():
        db.create_all()
    print("Database tables created.")
else:
    print("Database already exists. No need to create tables.")
