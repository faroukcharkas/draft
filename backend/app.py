# builtin
from contextlib import asynccontextmanager

# external
from fastapi import FastAPI
from supabase import create_client, Client as SupabaseClient
from pinecone.grpc import PineconeGRPC as Pinecone
from openai import AsyncOpenAI

# internal
from api.routes import api

# env variables
SUPABASE_URL: str = "https://lrzujclzezqrzlfsiste.supabase.co"
SUPABASE_ANON_KEY: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyenVqY2x6ZXpxcnpsZnNpc3RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYzMjkzOTAsImV4cCI6MjA0MTkwNTM5MH0.esIALlsS4vtpcSeF5FSkdTtRyXl5X19SrGm4jVKQR_I"
PINECONE_WRITING_SAMPLES_HOST: str = "https://writing-samples-wzfnr0a.svc.aped-4627-b74a.pinecone.io"
PINECONE_API_KEY: str = "a32a84c7-341e-41aa-b758-648b1c3e4150"
OPENAI_API_KEY: str = "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"

@asynccontextmanager
async def lifespan(app: FastAPI):
    supabase: SupabaseClient = create_client(
        supabase_url=SUPABASE_URL,
        supabase_key=SUPABASE_ANON_KEY,
    )

    app.state.supabase = supabase

    client: AsyncOpenAI = AsyncOpenAI(api_key=OPENAI_API_KEY)
    app.state.client = client

    pinecone: Pinecone = Pinecone(api_key=PINECONE_API_KEY)
    writing_samples_index = pinecone.Index("writing-samples")

    app.state.pinecone = pinecone
    app.state.writing_samples_index = writing_samples_index

    yield

app = FastAPI(lifespan=lifespan)

app.include_router(api, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Leave me alone."}

