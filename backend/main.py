from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class PredictRequest(BaseModel):
    textBeforeCursor: str
    textAfterCursor: str

class PredictResponse(BaseModel):
    prediction: str

@app.get("/")
async def root():
    return {"message": "Welcome to the Pentip API"}

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    # TODO: Implement prediction logic
    prediction = "Sample prediction"
    return PredictResponse(prediction=prediction)
