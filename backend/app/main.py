from fastapi import FastAPI, Depends
from .api.auth import auth_router


API_VERSION = "v1"
app = FastAPI(
    version=API_VERSION
)

app.include_router(auth_router, prefix=f"/api/{API_VERSION}/auth", tags=['Authentication'])