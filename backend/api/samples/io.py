# builtin
from uuid import UUID

# external
from pydantic import BaseModel

# internal
from models.samples import WritingSampleStyleType

class CreateWritingSampleInput(BaseModel):
    author_id: UUID
    text: str
    style: WritingSampleStyleType