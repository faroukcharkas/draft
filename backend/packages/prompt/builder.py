# external
from pydantic import BaseModel
from typing import Optional
# internal
from .src.templates.suggest.guidelines import SuggestGuidelines
from .src.templates.suggest.instruction import SuggestInstruction
from .src.templates.suggest.output import SuggestOutput
from .src.templates.suggest.input import SuggestInput
from .src.templates.suggest.samples import SuggestSamples

class PromptBuilder(BaseModel):
    @staticmethod
    def build_before_after_prompt(before: str, after: str, samples: list[str], description: Optional[str] = None) -> str:
        prompt = f"""
        {SuggestInstruction(before, after, description=description)}

        {SuggestSamples(samples)}

        {SuggestGuidelines()}
    
        {SuggestInput(before, after)}
        
        {SuggestOutput(before)}
        """
        print(f"Generated prompt:\n{prompt}")
        return prompt