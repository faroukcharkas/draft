from fastapi import APIRouter
from .predictions.routes import predict_router
from .samples.routes import samples_router
api: APIRouter = APIRouter()

api.include_router(predict_router)
api.include_router(samples_router)