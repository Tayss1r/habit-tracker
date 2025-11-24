from fastapi import APIRouter, HTTPException, status

from ..schemas.user_schemas import UserCreate, UserLogin
from ..services.user_service import UserService
from ..utils import verify

auth_router = APIRouter()
user_service = UserService()


@auth_router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    existing = await user_service.get_user_by_email(user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    profile_image = user.profile_image if user.profile_image else "user-2.jpg"
    await user_service.create_user(user.email, user.username, user.password, profile_image, user.is_admin)
    return {
        "message" : "account Created! Check your email inbox to verify you account",
    }

@auth_router.post("/login")
async def login(user: UserLogin):
    existing_user = await user_service.get_user_by_email(user.email)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check password
    if existing_user and verify(user.password, existing_user.password):
        return {
        "message": f"Welcome back, {existing_user.username}!",
        "user_id": str(existing_user.id),
        "username": existing_user.username,
        "email": existing_user.email,
        "profile_image": existing_user.profile_image,
        "is_admin": existing_user.is_admin
    }
    raise HTTPException(status_code=400, detail="Invalid Credentials")

    