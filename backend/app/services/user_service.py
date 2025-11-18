from typing import Optional
from bson import ObjectId
from passlib.hash import bcrypt
from ..schemas import PyObjectId
from ..schemas.user_schemas import User
from ..db.database import db
from ..utils import hash_password
class UserService:
    def __init__(self, collection_name: str = "users"):
        self.collection = db[collection_name]

    # Create a new user
    async def create_user(self, email: str, username: str, password: str) -> User:
        user_doc = {
            "email": email,
            "username": username,
            "password": self.hash_password(password),
            "created_at": None
        }
        result = await self.collection.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        return User(**user_doc)

    # Find a user by email
    async def get_user_by_email(self, email: str) -> Optional[User]:
        user_doc = await self.collection.find_one({"email": email})
        if user_doc:
            return User(**user_doc)
        return None

    # Find a user by id
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        user_doc = await self.collection.find_one({"_id": ObjectId(user_id)})
        if user_doc:
            return User(**user_doc)
        return None
