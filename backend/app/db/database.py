from motor.motor_asyncio import AsyncIOMotorClient
from ..core.config import settings

MONGO_URL = settings.MONGODB_URL

client = AsyncIOMotorClient(MONGO_URL)
db = client["habit_tracker"]

async def get_db():
    return db
