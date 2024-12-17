# builtin
from contextlib import asynccontextmanager

# external
from fastapi import FastAPI
from supabase import create_client, Client as SupabaseClient
from pinecone.grpc import PineconeGRPC as Pinecone
from openai import AsyncOpenAI

# internal
from src.api.routes import api
from src.globals.environment import DraftEnvironment


@asynccontextmanager
async def lifespan(app: FastAPI):
    supabase: SupabaseClient = create_client(
        supabase_url=DraftEnvironment.supabase_url,
        supabase_key=DraftEnvironment.supabase_key,
    )

    app.state.supabase = supabase

    client: AsyncOpenAI = AsyncOpenAI(api_key=DraftEnvironment.openai_api_key)
    app.state.client = client

    pinecone: Pinecone = Pinecone(api_key=DraftEnvironment.pinecone_api_key)
    writing_samples_index = pinecone.Index("writing-samples")

    app.state.pinecone = pinecone
    app.state.writing_samples_index = writing_samples_index

    yield


app = FastAPI(lifespan=lifespan)

app.include_router(api, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "Leave me alone."}
