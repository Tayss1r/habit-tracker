from fastapi import APIRouter, HTTPException, Query
from typing import List
from datetime import datetime, timedelta
from ..schemas.user_schemas import User
from ..services.user_service import UserService
from ..services.habit_service import HabitService
from ..db.database import db

admin_router = APIRouter()
user_service = UserService()
habit_service = HabitService()


@admin_router.get("/users")
async def get_all_users(admin_user_id: str = Query(...)):
    """Get all users (admin only)"""
    admin = await user_service.get_user_by_id(admin_user_id)
    if not admin or not admin.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    users = await user_service.get_all_users()
    return [{"id": str(u.id), "username": u.username, "email": u.email, "is_admin": u.is_admin, "created_at": u.created_at} for u in users]


@admin_router.delete("/users/{user_id}")
async def delete_user(user_id: str, admin_user_id: str = Query(...)):
    """Delete a user (admin only)"""
    admin = await user_service.get_user_by_id(admin_user_id)
    if not admin or not admin.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    success = await user_service.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User deleted successfully"}


@admin_router.get("/statistics/overview")
async def get_overview_statistics(admin_user_id: str = Query(...)):
    """Get overview statistics (admin only)"""
    admin = await user_service.get_user_by_id(admin_user_id)
    if not admin or not admin.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Get all collections
    users_collection = db["users"]
    habits_collection = db["habits"]
    logs_collection = db["habit_logs"]
    
    # Count total users
    total_users = await users_collection.count_documents({})
    
    # Count total habits
    total_habits = await habits_collection.count_documents({"is_active": True})
    
    # Count total logs
    total_logs = await logs_collection.count_documents({"is_done": True})
    
    # Get active users (users with habits)
    active_users_cursor = habits_collection.aggregate([
        {"$group": {"_id": "$user_id"}},
        {"$count": "count"}
    ])
    active_users_result = await active_users_cursor.to_list(1)
    active_users = active_users_result[0]["count"] if active_users_result else 0
    
    # Get logs from last 7 days
    seven_days_ago = datetime.now() - timedelta(days=7)
    recent_logs = await logs_collection.count_documents({
        "date": {"$gte": seven_days_ago},
        "is_done": True
    })
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_habits": total_habits,
        "total_completions": total_logs,
        "recent_completions": recent_logs
    }


@admin_router.get("/statistics/habits-by-category")
async def get_habits_by_category(admin_user_id: str = Query(...)):
    """Get habits count by category (admin only)"""
    admin = await user_service.get_user_by_id(admin_user_id)
    if not admin or not admin.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    habits_collection = db["habits"]
    
    pipeline = [
        {"$match": {"is_active": True}},
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    
    cursor = habits_collection.aggregate(pipeline)
    results = await cursor.to_list(None)
    
    return [{"category": r["_id"] or "Uncategorized", "count": r["count"]} for r in results]


@admin_router.get("/statistics/habits-by-priority")
async def get_habits_by_priority(admin_user_id: str = Query(...)):
    """Get habits count by priority (admin only)"""
    admin = await user_service.get_user_by_id(admin_user_id)
    if not admin or not admin.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    habits_collection = db["habits"]
    
    pipeline = [
        {"$match": {"is_active": True}},
        {"$group": {"_id": "$priority", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    
    cursor = habits_collection.aggregate(pipeline)
    results = await cursor.to_list(None)
    
    return [{"priority": r["_id"] or "Medium", "count": r["count"]} for r in results]


@admin_router.get("/statistics/completion-trend")
async def get_completion_trend(admin_user_id: str = Query(...), days: int = 30):
    """Get completion trend over time (admin only)"""
    admin = await user_service.get_user_by_id(admin_user_id)
    if not admin or not admin.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    logs_collection = db["habit_logs"]
    
    # Get logs for the last N days
    start_date = datetime.now() - timedelta(days=days)
    
    pipeline = [
        {"$match": {
            "date": {"$gte": start_date},
            "is_done": True
        }},
        {"$group": {
            "_id": {
                "$dateToString": {"format": "%Y-%m-%d", "date": "$date"}
            },
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}
    ]
    
    cursor = logs_collection.aggregate(pipeline)
    results = await cursor.to_list(None)
    
    return [{"date": r["_id"], "completions": r["count"]} for r in results]


@admin_router.get("/statistics/user-activity")
async def get_user_activity(admin_user_id: str = Query(...)):
    """Get top active users (admin only)"""
    admin = await user_service.get_user_by_id(admin_user_id)
    if not admin or not admin.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    logs_collection = db["habit_logs"]
    users_collection = db["users"]
    
    # Get top users by completion count
    pipeline = [
        {"$match": {"is_done": True}},
        {"$group": {"_id": "$user_id", "completions": {"$sum": 1}}},
        {"$sort": {"completions": -1}},
        {"$limit": 10}
    ]
    
    cursor = logs_collection.aggregate(pipeline)
    results = await cursor.to_list(None)
    
    # Get usernames
    user_activity = []
    for r in results:
        user = await user_service.get_user_by_id(r["_id"])
        if user:
            user_activity.append({
                "username": user.username,
                "completions": r["completions"]
            })
    
    return user_activity


@admin_router.get("/statistics/new-users")
async def get_new_users(admin_user_id: str = Query(...), days: int = 30):
    """Get new user registrations over time"""
    admin = await user_service.get_user_by_id(admin_user_id)
    if not admin or not admin.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    users_collection = db["users"]
    
    start_date = datetime.now() - timedelta(days=days)
    
    pipeline = [
        {"$match": {"created_at": {"$gte": start_date}}},
        {"$group": {
            "_id": {
                "$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}
            },
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}
    ]
    
    cursor = users_collection.aggregate(pipeline)
    results = await cursor.to_list(None)
    
    return [{"date": r["_id"], "new_users": r["count"]} for r in results]
