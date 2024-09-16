from .components import Hole

def identity_statement() -> str:
    return f"""
    You are an assistant to an author. Help the author at the marker called {Hole}.
    """

def beginning_of_text() -> str:
    return """
    You are tasked with coming up with a good start for the author's passage.
    """

def end_of_text() -> str:
    return """
    You are tasked with predicting the next words the user will write. Only predict as many words as appropriate.
    """

def middle_of_text() -> str:
    return """
    You are tasked with revising the passage to improve clarity, flow, and style.
    """

def PredictInstruction(before: str, after: str) -> str:
    if len(before) == 0:
        return f"{identity_statement()} {beginning_of_text()}"
    elif len(after) == 0:
        return f"{identity_statement()} {end_of_text()}"
    else:
        return f"{identity_statement()} {middle_of_text()}"
