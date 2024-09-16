# builtin
from contextlib import asynccontextmanager
import os

# external
from fastapi import FastAPI
from supabase import create_client, Client as SupabaseClient

# internal
from api.routes import api

# env variables
SUPABASE_URL: str = "https://lrzujclzezqrzlfsiste.supabase.co"
SUPABASE_ANON_KEY: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyenVqY2x6ZXpxcnpsZnNpc3RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYzMjkzOTAsImV4cCI6MjA0MTkwNTM5MH0.esIALlsS4vtpcSeF5FSkdTtRyXl5X19SrGm4jVKQR_I"

@asynccontextmanager
async def lifespan(app: FastAPI):
    supabase: SupabaseClient = create_client(
        supabase_url=SUPABASE_URL,
        supabase_key=SUPABASE_ANON_KEY,
    )

    app.state.supabase = supabase

    yield

app = FastAPI(lifespan=lifespan)

app.include_router(api, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Leave me alone."}

