# builtin
from uuid import UUID

# external
from pydantic import BaseModel

class PredictInput(BaseModel):
    textBeforeCursor: str
    textAfterCursor: str
    authorId: UUID


class PredictOutput(BaseModel):
    prediction: str
