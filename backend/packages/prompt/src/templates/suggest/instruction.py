from typing import Optional

def SuggestInstruction(before: str, after: str, description: Optional[str] = None   ) -> str:
    if description is None:
        description = ""
    else:
        description = f"working on {description}"
    return f"You are a writing prediction assistant {description}. Using the context of the document and the user's writing style, predict the next words the author will write."
