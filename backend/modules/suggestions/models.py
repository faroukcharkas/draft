# external
from pydantic import BaseModel

class Suggestion(BaseModel):
    words_before_suggestion: str
    suggestion: str
    words_after_suggestion: str
