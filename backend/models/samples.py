# builtin
from uuid import UUID
from datetime import datetime
from enum import Enum
# external
from pydantic import BaseModel

class WritingSampleStyleType(str, Enum):
    FORMAL = "formal"
    CASUAL = "casual"

class WritingSample(BaseModel):
    id: UUID
    content: str
    created_at: datetime
    style: WritingSampleStyleType