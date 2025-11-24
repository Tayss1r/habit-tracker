from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .api.auth import auth_router
from .api.habits import habits_router
from .api.admin import admin_router
from .api.user import user_router


API_VERSION = "v1"
app = FastAPI(
    version=API_VERSION
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix=f"/api/{API_VERSION}/auth", tags=['Authentication'])
app.include_router(habits_router, prefix=f"/api/{API_VERSION}", tags=['Habits'])
app.include_router(admin_router, prefix=f"/api/{API_VERSION}/admin", tags=['Admin'])
app.include_router(user_router, prefix=f"/api/{API_VERSION}/users", tags=['Users'])