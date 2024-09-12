# external
from fastapi import FastAPI

# internal
from api.routes import api

app = FastAPI()

app.include_router(api, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Leave me alone."}

