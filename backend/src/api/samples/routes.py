# builtin
import logging
from uuid import UUID
import json

# external
from fastapi import APIRouter, Request, HTTPException
from supabase import Client as SupabaseClient
from openai import AsyncOpenAI
from pinecone import Index as PineconeIndex

# internal
from src.api.samples.io import CreateWritingSampleInput
from src.providers.splitting.semantic import SemanticSplittingProvider
from src.models.samples import WritingSampleStyleType
from src.modules.bias.module import BiasModule

logger = logging.getLogger(__name__)

samples_router: APIRouter = APIRouter(prefix="/samples")

async def insert_and_upsert_chunk(supabase: SupabaseClient, openai: AsyncOpenAI, writing_samples_index: PineconeIndex, sample_id: UUID, user_id: UUID, writing_style: WritingSampleStyleType, chunks: list[str]):
    vectors = []
    for chunk in chunks:
        response = supabase.table("sample_chunk").upsert({
            "sample_id": str(sample_id),
            "text": chunk,
            "writing_style": writing_style.value,
            "user_id": str(user_id),
        }).execute()
        if len(response.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to create sample chunk")
        embedding = await openai.embeddings.create(input=chunk, model="text-embedding-ada-002")
        embedding_vector = embedding.data[0].embedding
        sample_chunk = response.data[0]
        vectors.append({
            "id": sample_chunk["id"],
            "values": embedding_vector,
            "metadata": {
                "sample_id": str(sample_id),
                "user_id": str(user_id),
                "writing_style": writing_style.value,
                "text": chunk,
            }
        })
    writing_samples_index.upsert(vectors)


@samples_router.post("/create")
async def create_samples(request: Request, input: CreateWritingSampleInput):
    # 1. Create Supabase object
    supabase: SupabaseClient = request.app.state.supabase
    openai: AsyncOpenAI = request.app.state.client
    writing_samples_index: PineconeIndex = request.app.state.writing_samples_index
    # 2. Ceate writing sample in Supabase
    print({
        "user_id": str(input.user_id),
        "writing_style": input.style,
        "text": input.text,
    })
    response = supabase.table("writing_sample").insert({
        "user_id": str(input.user_id),
        "writing_style": input.style.value,
        "text": input.text,
    }).execute()

    writing_samples = supabase.table("writing_sample").select("*").eq("user_id", str(input.user_id)).execute()
    print(writing_samples.data)
    logit_bias = BiasModule.calculate_bias([sample["text"] for sample in writing_samples.data])

    logit_response = supabase.table("logit_bias").insert({
        "weights": json.dumps(logit_bias),
        "user_id": str(input.user_id),
    }).execute()
    
    if len(response.data) == 0:
        raise HTTPException(status_code=500, detail="Failed to create writing sample")
    
    writing_sample = response.data[0]
    # 3. Chunk up the text sementically
    chunks: list[str] = SemanticSplittingProvider.split(original_text=input.text)
    # 4. Create writing sample chunks in Supabase
    await insert_and_upsert_chunk(supabase=supabase, openai=openai, writing_samples_index=writing_samples_index, sample_id=UUID(writing_sample["id"]), user_id=input.user_id, writing_style=input.style, chunks=chunks)
    return {"message": "Chunks created"}
    

@samples_router.post("/update")
async def update_samples():
    return {"message": "This is the update samples endpoint"}


@samples_router.post("/delete")
async def delete_samples():
    return {"message": "This is the delete samples endpoint"}