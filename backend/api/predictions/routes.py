# external
from fastapi import APIRouter, Request
from pinecone import Index as PineconeIndex
from openai import AsyncOpenAI

# internal
from .io import PredictInput
from packages.prompt import PromptBuilder

predict_router: APIRouter = APIRouter(prefix="/predictions")

@predict_router.post("/predict")
async def predict(request: Request, input: PredictInput):
    writing_samples_index: PineconeIndex = request.app.state.writing_samples_index
    openai: AsyncOpenAI = request.app.state.client

    # 1. Embed the last 100 characters of the user's text
    embedding = await openai.embeddings.create(input=input.textAfterCursor[-100:], model="text-embedding-ada-002")
    embedding_vector = embedding.data[0].embedding

    # 2. Query the writing samples index
    query_response: str = writing_samples_index.query(vector=embedding_vector, top_k=3, include_values=False)

    return {"message": "This is the predict endpoint"}
