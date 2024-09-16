# builtin
import logging
from uuid import UUID
# external
from fastapi import APIRouter, Request, HTTPException
from supabase import Client as SupabaseClient

# internal
from api.samples.io import CreateWritingSampleInput
from providers.splitting.semantic import SemanticSplittingProvider
from models.samples import WritingSampleStyleType

logger = logging.getLogger(__name__)

samples_router: APIRouter = APIRouter(prefix="/samples")

async def insert_and_upsert_chunk(supabase: SupabaseClient, sample_id: UUID, author_id: UUID, writing_style: WritingSampleStyleType, chunks: list[str]):
    for chunk in chunks:
        response = supabase.table("sample_chunk").upsert({
            "sample_id": str(sample_id),
            "text": chunk,
            "writing_style": writing_style.value,
            "author_id": str(author_id),
        }).execute()
        if len(response.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to create sample chunk")
        sample_chunk = response.data[0]
        print(sample_chunk)


@samples_router.post("/create")
async def create_samples(request: Request, input: CreateWritingSampleInput):
    # 1. Create Supabase object
    supabase: SupabaseClient = request.app.state.supabase
    # 2. Ceate writing sample in Supabase
    print({
        "author_id": str(input.author_id),
        "writing_style": input.style,
        "text": input.text,
    })
    response = supabase.table("writing_sample").insert({
        "author_id": str(input.author_id),
        "writing_style": input.style.value,
        "text": input.text,
    }).execute()
    
    if len(response.data) == 0:
        raise HTTPException(status_code=500, detail="Failed to create writing sample")
    
    writing_sample = response.data[0]
    # 3. Chunk up the text sementically
    chunks: list[str] = SemanticSplittingProvider.split(original_text=input.text)
    # 4. Create writing sample chunks in Supabase
    await insert_and_upsert_chunk(supabase=supabase, sample_id=UUID(writing_sample["id"]), author_id=input.author_id, writing_style=input.style, chunks=chunks)
    return {"message": "Chunks created"}
    


@samples_router.post("/update")
async def update_samples():
    return {"message": "This is the update samples endpoint"}


@samples_router.post("/delete")
async def delete_samples():
    return {"message": "This is the delete samples endpoint"}