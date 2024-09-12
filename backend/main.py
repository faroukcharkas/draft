# external
from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Leave me alone."}

def start():
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)