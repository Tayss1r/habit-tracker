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
    created_at: Optional[datetime] = Field(default_factory=datetime.now)


class UserCreate(BaseModel):
    email: str
    username: str
    password: str



