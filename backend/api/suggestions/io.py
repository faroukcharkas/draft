# external
from pydantic import BaseModel


class SuggestInput(BaseModel):
    text_before_cursor: str
    text_after_cursor: str


class SuggestOutput(BaseModel):
    words_before_suggestion: str
    suggestion: str
    words_after_suggestion: str
