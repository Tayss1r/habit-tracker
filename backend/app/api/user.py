from fastapi import APIRouter, HTTPException, status
from app.schemas.user_schemas import UserUpdate, User
from app.services.user_service import user_service

user_router = APIRouter()

@user_router.get("/{user_id}", response_model=User)
async def get_user(user_id: str):
    """Get user profile by ID"""
    user = await user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@user_router.put("/{user_id}", response_model=User)
async def update_user(user_id: str, user_update: UserUpdate):
    """Update user profile"""
    existing_user = await user_service.get_user_by_id(user_id)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if email is being changed and if it's already in use
    if user_update.email and user_update.email != existing_user.email:
        email_exists = await user_service.get_user_by_email(user_update.email)
        if email_exists:
            raise HTTPException(status_code=400, detail="Email already in use")
    
    updated_user = await user_service.update_user(user_id, user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return updated_user
