# external
from pydantic import BaseModel

# internal
from .src.templates.predict.guidelines import SuggestGuidelines
from .src.templates.predict.instruction import SuggestInstruction
from .src.templates.predict.output import SuggestOutput
from .src.templates.predict.input import SuggestInput
from .src.templates.predict.samples import PredictSamples

class PromptBuilder(BaseModel):
    @staticmethod
    def build_before_after_prompt(before: str, after: str, samples: list[str]) -> str:
        return f"""
        {SuggestInstruction(before, after)}

        {PredictSamples(samples)}
    
        {SuggestInput(before, after)}

        {SuggestGuidelines(before, after)}
        
        {SuggestOutput(before, after)}
        """