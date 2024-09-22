# external
from fastapi import APIRouter, Request, HTTPException
from pinecone import Index as PineconeIndex
from openai import AsyncOpenAI, ChatCompletion

# internal
from .io import SuggestInput, SuggestOutput
from modules.suggestions.module import SuggestParams, SuggestionsModule
from modules.suggestions.models import Suggestion

suggest_router: APIRouter = APIRouter(prefix="/suggestions")

@suggest_router.post("/suggest")
async def suggest(request: Request, input: SuggestInput) -> SuggestOutput:
    user_id: str = request.headers.get("x-user-id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not provided")
    writing_samples_index: PineconeIndex = request.app.state.writing_samples_index
    openai: AsyncOpenAI = request.app.state.client

    suggestion: Suggestion = await SuggestionsModule.suggest(
        SuggestParams(
            user_id=user_id,
            text_before_cursor=input.text_before_cursor,
            text_after_cursor=input.text_after_cursor
        ),
        writing_samples_index,
        openai
    )

    print(suggestion)

    return SuggestOutput(
        words_before_suggestion=suggestion.words_before_suggestion,
        suggestion=suggestion.suggestion,
        words_after_suggestion=suggestion.words_after_suggestion
    )
