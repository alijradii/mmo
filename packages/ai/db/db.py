import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("SERVER_DB")
DB_NAME = "ncnl"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def get_db():
    return db
