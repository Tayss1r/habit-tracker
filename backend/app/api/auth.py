from fastapi import APIRouter, HTTPException, status

from ..schemas.user_schemas import UserCreate
from ..services.user_service import UserService

auth_router = APIRouter()
user_service = UserService()


@auth_router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    existing = await user_service.get_user_by_email(user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    await user_service.create_user(user.email, user.username, user.password)
    return {
        "message" : "account Created! Check your email inbox to verify you account",
    }