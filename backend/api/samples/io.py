# external
from pydantic import BaseModel

# internal
from models.samples import WritingSampleStyleType

class CreateWritingSampleInput(BaseModel):
    content: str
    style: WritingSampleStyleType