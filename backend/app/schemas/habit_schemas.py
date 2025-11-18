from typing import Optional, Annotated
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from ..schemas import PyObjectId

class Habit(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: PyObjectId
    title: str
    description: Optional[str] = None
    category: Optional[str] = None          # e.g., Health, Study, Personal
    priority: Optional[str] = "Medium"     # Low / Medium / High
    created_at: datetime = Field(default_factory=datetime.now)
    is_active: bool = True                  # Can deactivate habits

class HabitLog(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    habit_id: PyObjectId
    user_id: PyObjectId
    date: datetime = Field(default_factory=datetime.now)
    is_done: bool = False