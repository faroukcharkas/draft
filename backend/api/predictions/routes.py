# external
from fastapi import APIRouter

predict_router: APIRouter = APIRouter(prefix="/predictions")

@predict_router.post("/predict")
async def predict():
    return {"message": "This is the predict endpoint"}
