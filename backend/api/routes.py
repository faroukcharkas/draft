from fastapi import APIRouter
from .suggestions.routes import suggest_router
from .samples.routes import samples_router
api: APIRouter = APIRouter()

api.include_router(suggest_router)
api.include_router(samples_router)
