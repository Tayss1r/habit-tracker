from typing import Optional
from datetime import datetime
from bson import ObjectId
from passlib.hash import bcrypt
from ..schemas import PyObjectId
from ..schemas.user_schemas import User, UserUpdate
from ..db.database import db
from ..utils import hash
class UserService:
    def __init__(self, collection_name: str = "users"):
        self.collection = db[collection_name]

    # Create a new user
    async def create_user(self, email: str, username: str, password: str, profile_image: str = "user-2.jpg", is_admin: bool = False) -> User:
        user_doc = {
            "email": email,
            "username": username,
            "password": hash(password),
            "profile_image": profile_image,
            "is_admin": is_admin,
            "created_at": datetime.now()
        }
        result = await self.collection.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        return User(**user_doc)

    # Get all users (admin only)
    async def get_all_users(self):
        cursor = self.collection.find({})
        users = []
        async for user_doc in cursor:
            users.append(User(**user_doc))
        return users

    # Update user
    async def update_user(self, user_id: str, update_data: UserUpdate) -> Optional[User]:
        # Convert Pydantic model → dict
        update_data_dict = update_data.model_dump(exclude_none=True)

        # Hash password if it exists
        if "password" in update_data_dict:
            update_data_dict["password"] = hash(update_data_dict["password"])

        # Update in DB
        result = await self.collection.find_one_and_update(
            {"_id": ObjectId(user_id)},
            {"$set": update_data_dict},
            return_document=True
        )

        if result:
            return User(**result)

        return None


    # Delete user
    async def delete_user(self, user_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0

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

user_service = UserService()
