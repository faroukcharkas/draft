from fastapi import APIRouter
from .predict.routes import predict_router

api: APIRouter = APIRouter()

api.include_router(predict_router)