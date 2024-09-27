# builtin
from uuid import UUID

# external
from pydantic import BaseModel
from pinecone import Index as PineconeIndex
from openai import AsyncOpenAI, ChatCompletion

# internal
from .models import Suggestion
from packages.prompt.builder import PromptBuilder

class SuggestParams(BaseModel):
    user_id: UUID
    text_before_cursor: str
    text_after_cursor: str

class SuggestionsModule:
    @staticmethod
    async def suggest(params: SuggestParams, writing_samples_index: PineconeIndex, openai: AsyncOpenAI) -> Suggestion:
        # 1. Embed the last 100 characters of the user's text
        embedding = await openai.embeddings.create(input=params.text_before_cursor[-100:], model="text-embedding-ada-002")
        embedding_vector = embedding.data[0].embedding

        # 2. Query the writing samples index
        query_response = writing_samples_index.query(
            vector=embedding_vector,
            top_k=3,
            include_values=False,
            include_metadata=True,
            filter={"user_id": str(params.user_id)}
        )
        samples: list[str] = [sample.metadata["text"] for sample in query_response.matches]

        # 3. Build the prompt
        prompt: str = PromptBuilder.build_before_after_prompt(params.text_before_cursor, params.text_after_cursor, samples)

        # 4. Make the prediction
        response: ChatCompletion = await openai.chat.completions.create(model="gpt-4o-mini", messages=[{"role": "system", "content": prompt}])

        return Suggestion(next_words=response.choices[0].message.content)

