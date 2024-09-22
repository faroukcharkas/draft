def beginning_of_text() -> str:
    return """
    You are an AI assistant that helps authors with great introductions.
    """

def end_of_text() -> str:
    return """
    You are a prediction assistant to an author. Help the author figure out the next words to write.
    """

def middle_of_text() -> str:
    return """
    You are tasked with suggesting revisions to the passage to improve clarity, flow, and style.
    """

def SuggestInstruction(before: str, after: str) -> str:
    if len(before) == 0:
        return f"{beginning_of_text()}"
    elif len(after) == 0:
        return f"{end_of_text()}"
    else:
        return f"{middle_of_text()}"
