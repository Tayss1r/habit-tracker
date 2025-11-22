from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from ..schemas.habit_schemas import Habit, HabitLog
from ..db.database import db


class HabitService:
    def __init__(self):
        self.habits_collection = db["habits"]
        self.logs_collection = db["habit_logs"]

    # Create a new habit
    async def create_habit(self, user_id: str, title: str, description: Optional[str] = None, 
                          category: Optional[str] = None, priority: Optional[str] = "Medium") -> Habit:
        habit_doc = {
            "user_id": user_id,
            "title": title,
            "description": description,
            "category": category,
            "priority": priority,
            "created_at": datetime.now(),
            "is_active": True
        }
        result = await self.habits_collection.insert_one(habit_doc)
        habit_doc["_id"] = result.inserted_id
        return Habit(**habit_doc)

    # Get all habits for a user
    async def get_user_habits(self, user_id: str) -> List[Habit]:
        cursor = self.habits_collection.find({"user_id": user_id, "is_active": True})
        habits = []
        async for habit_doc in cursor:
            habits.append(Habit(**habit_doc))
        return habits

    # Get a single habit by ID
    async def get_habit_by_id(self, habit_id: str) -> Optional[Habit]:
        habit_doc = await self.habits_collection.find_one({"_id": ObjectId(habit_id)})
        if habit_doc:
            return Habit(**habit_doc)
        return None

    # Update habit
    async def update_habit(self, habit_id: str, update_data: dict) -> Optional[Habit]:
        result = await self.habits_collection.find_one_and_update(
            {"_id": ObjectId(habit_id)},
            {"$set": update_data},
            return_document=True
        )
        if result:
            return Habit(**result)
        return None

    # Delete (deactivate) habit
    async def delete_habit(self, habit_id: str) -> bool:
        result = await self.habits_collection.update_one(
            {"_id": ObjectId(habit_id)},
            {"$set": {"is_active": False}}
        )
        return result.modified_count > 0

    # Create a habit log entry
    async def create_habit_log(self, habit_id: str, user_id: str, is_done: bool = True) -> HabitLog:
        log_doc = {
            "habit_id": habit_id,
            "user_id": user_id,
            "date": datetime.now(),
            "is_done": is_done
        }
        result = await self.logs_collection.insert_one(log_doc)
        log_doc["_id"] = result.inserted_id
        return HabitLog(**log_doc)

    # Get habit logs for a specific habit
    async def get_habit_logs(self, habit_id: str) -> List[HabitLog]:
        cursor = self.logs_collection.find({"habit_id": habit_id}).sort("date", -1)
        logs = []
        async for log_doc in cursor:
            logs.append(HabitLog(**log_doc))
        return logs

    # Check if habit was completed today
    async def is_habit_done_today(self, habit_id: str) -> bool:
        today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        log = await self.logs_collection.find_one({
            "habit_id": habit_id,
            "date": {"$gte": today_start},
            "is_done": True
        })
        return log is not None
