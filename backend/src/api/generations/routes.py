# external
from fastapi import APIRouter, Request
from openai import AsyncOpenAI
from openai.types.chat import ChatCompletion
# internal
from .io import GenerateInput, GenerateOutput

generations_router: APIRouter = APIRouter(prefix="/generations")

@generations_router.post("/generate")
async def generate(request: Request, input: GenerateInput) -> GenerateOutput:
    client: AsyncOpenAI = request.app.state.client

    completion: ChatCompletion = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"""
             You are a helpful AI writing assistant. Given a text selection and a command, you will generate text according to that command, and it will be displayed to the user as a diff.

             Here's the text selection:
             <selection>
             {input.selection}
             </selection>

             Here's the command:
             {input.command}

            Generate the text:
             """},
        ],
    )

    return GenerateOutput(
        generation=completion.choices[0].message.content
    )
