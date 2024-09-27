# external
from pydantic import BaseModel

# internal
from .src.templates.suggest.guidelines import SuggestGuidelines
from .src.templates.suggest.instruction import SuggestInstruction
from .src.templates.suggest.output import SuggestOutput
from .src.templates.suggest.input import SuggestInput
from .src.templates.suggest.samples import SuggestSamples

class PromptBuilder(BaseModel):
    @staticmethod
    def build_before_after_prompt(before: str, after: str, samples: list[str]) -> str:
        prompt = f"""
        {SuggestInstruction(before, after)}

        {SuggestSamples(samples)}

        {SuggestGuidelines()}
    
        {SuggestInput(before, after)}
        
        {SuggestOutput(before)}
        """
        print(f"Generated prompt:\n{prompt}")
        return prompt