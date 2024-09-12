from api.routes import api

@api.post("/predict")
async def predict():
    return {"message": "This is the predict endpoint"}
