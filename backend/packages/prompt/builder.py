# external
from pydantic import BaseModel

# internal
from .src.templates.predict.guidelines import PredictGuidelines
from .src.templates.predict.instruction import PredictInstruction
from .src.templates.predict.output import PredictOutput
from .src.templates.predict.input import PredictInput
from .src.templates.predict.samples import PredictSamples

class PromptBuilder(BaseModel):
    @staticmethod
    def build_before_after_prompt(before: str, after: str, samples: list[str]) -> str:
        return f"""
        {PredictInstruction(before, after)}

        {PredictSamples(samples)}
    
        {PredictInput(before, after)}

        {PredictGuidelines(before, after)}
        
        {PredictOutput(before, after)}
        """