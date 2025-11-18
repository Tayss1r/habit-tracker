from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URL")

try:
    client = MongoClient(MONGO_URI)
    client.admin.command('ismaster')
    print("Connected to MongoDB successfully!")
except Exception as e:
    print("Could not connect to MongoDB:", e)
