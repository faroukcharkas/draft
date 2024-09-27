# external
from pydantic import BaseModel

class Suggestion(BaseModel):
    next_words: str
