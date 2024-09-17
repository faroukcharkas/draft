# external
from fastapi import APIRouter, Request
from pinecone import Index as PineconeIndex
from openai import AsyncOpenAI

# internal
from .io import PredictInput, PredictOutput
from packages.prompt import PromptBuilder

predict_router: APIRouter = APIRouter(prefix="/predictions")

@predict_router.post("/predict")
async def predict(request: Request, input: PredictInput) -> PredictOutput:
    writing_samples_index: PineconeIndex = request.app.state.writing_samples_index
    openai: AsyncOpenAI = request.app.state.client

    # 1. Embed the last 100 characters of the user's text
    embedding = await openai.embeddings.create(input=input.textBeforeCursor[-100:], model="text-embedding-ada-002")
    embedding_vector = embedding.data[0].embedding

    # 2. Query the writing samples index
    query_response = writing_samples_index.query(
        vector=embedding_vector,
        top_k=3,
        include_values=False,
        include_metadata=True,
        filter={"author_id": str(input.authorId)}
    )
    samples: list[str] = [sample.metadata["text"] for sample in query_response.matches]

    # 3. Build the prompt
    prompt: str = PromptBuilder.build_before_after_prompt(input.textBeforeCursor, input.textAfterCursor, samples)

    print(prompt)

    # 4. Make the prediction
    prediction: str = await openai.chat.completions.create(model="gpt-4o-mini", messages=[{"role": "system", "content": prompt}])

    # 5. Return the prediction
    return PredictOutput(prediction=prediction.choices[0].message.content)
