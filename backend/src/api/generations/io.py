# external
from pydantic import BaseModel

class GenerateInput(BaseModel):
    selection: str
    command: str

class GenerateOutput(BaseModel):
    generation: str
    
    