# external
from pydantic import BaseModel

class PredictInput(BaseModel):
    textBeforeCursor: str
    textAfterCursor: str