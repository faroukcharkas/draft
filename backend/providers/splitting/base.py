# builtin
from abc import ABC, abstractmethod

# external
from pydantic import BaseModel

class BaseSplittingProvider(ABC, BaseModel):
    @abstractmethod
    def split(self, original_text: str) -> list[str]:
        raise NotImplementedError
