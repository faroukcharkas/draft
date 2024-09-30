# external
from fastapi import APIRouter, Request, HTTPException
from pinecone import Index as PineconeIndex
from openai import AsyncOpenAI
from supabase import Client as SupabaseClient

# internal
from .io import SuggestInput, SuggestOutput
from src.modules.suggestions.module import SuggestParams, SuggestionsModule
from src.modules.suggestions.models import Suggestion

suggest_router: APIRouter = APIRouter(prefix="/suggestions")

@suggest_router.post("/suggest")
async def suggest(request: Request, input: SuggestInput) -> SuggestOutput:
    user_id: str = request.headers.get("x-user-id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not provided")
    writing_samples_index: PineconeIndex = request.app.state.writing_samples_index
    openai: AsyncOpenAI = request.app.state.client
    supabase: SupabaseClient = request.app.state.supabase
    
    suggestion: Suggestion = await SuggestionsModule.suggest(
        SuggestParams(
            user_id=user_id,
            text_before_cursor=input.text_before_cursor,
            text_after_cursor=input.text_after_cursor,
            document_id=input.document_id
        ),
        writing_samples_index,
        openai,
        supabase
    )

    return SuggestOutput(
        next_words=suggestion.next_words
    )
