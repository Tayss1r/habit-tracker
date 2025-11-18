from fastapi import APIRouter, HTTPException

from backend.app.schemas.user_schemas import UserCreate
from ..schemas.user_schemas import User
from ..services.user_service import UserService
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["Users"])
user_service = UserService()


@router.post("/register", response_model=User)
async def register(user: UserCreate):
    existing = await user_service.get_user_by_email(user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    return await user_service.create_user(user.email, user.username, user.password)
