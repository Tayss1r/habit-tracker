from typing import Optional, Annotated
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator

# Convert ObjectId to string automatically
PyObjectId = Annotated[str, BeforeValidator(str)]

class User(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    email: EmailStr
    password: str
    username: str
    profile_image: Optional[str] = "user-2.jpg"
    is_admin: bool = False
    created_at: Optional[datetime] = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}


class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    profile_image: Optional[str] = "user-2.jpg"
    is_admin: bool = False


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    profile_image: Optional[str] = None
    password: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str

