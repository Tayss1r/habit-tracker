from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..schemas.habit_schemas import Habit, HabitLog
from ..services.habit_service import HabitService
from pydantic import BaseModel

habits_router = APIRouter()
habit_service = HabitService()


class HabitCreate(BaseModel):
    user_id: str
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = "Medium"


class HabitLogCreate(BaseModel):
    habit_id: str
    user_id: str
    is_done: bool = True


@habits_router.post("/habits", response_model=Habit, status_code=201)
async def create_habit(habit: HabitCreate):
    """Create a new habit"""
    return await habit_service.create_habit(
        user_id=habit.user_id,
        title=habit.title,
        description=habit.description,
        category=habit.category,
        priority=habit.priority
    )


@habits_router.get("/habits", response_model=List[Habit])
async def get_habits(user_id: str = Query(..., description="User ID to fetch habits for")):
    """Get all habits for a specific user"""
    habits = await habit_service.get_user_habits(user_id)
    return habits


@habits_router.get("/habits/{habit_id}", response_model=Habit)
async def get_habit(habit_id: str):
    """Get a specific habit by ID"""
    habit = await habit_service.get_habit_by_id(habit_id)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit


@habits_router.put("/habits/{habit_id}", response_model=Habit)
async def update_habit(habit_id: str, habit: HabitCreate):
    """Update a habit"""
    update_data = habit.dict(exclude_unset=True)
    updated_habit = await habit_service.update_habit(habit_id, update_data)
    if not updated_habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return updated_habit


@habits_router.delete("/habits/{habit_id}")
async def delete_habit(habit_id: str):
    """Delete (deactivate) a habit"""
    success = await habit_service.delete_habit(habit_id)
    if not success:
        raise HTTPException(status_code=404, detail="Habit not found")
    return {"message": "Habit deleted successfully"}


@habits_router.post("/habit-logs", response_model=HabitLog, status_code=201)
async def create_habit_log(log: HabitLogCreate):
    """Mark a habit as done by creating a log entry"""
    return await habit_service.create_habit_log(
        habit_id=log.habit_id,
        user_id=log.user_id,
        is_done=log.is_done
    )


@habits_router.get("/habit-logs/{habit_id}", response_model=List[HabitLog])
async def get_habit_logs(habit_id: str):
    """Get all logs for a specific habit"""
    return await habit_service.get_habit_logs(habit_id)


@habits_router.get("/habits/{habit_id}/status")
async def get_habit_status(habit_id: str):
    """Check if a habit was completed today"""
    is_done = await habit_service.is_habit_done_today(habit_id)
    return {"habit_id": habit_id, "done_today": is_done}
