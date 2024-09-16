from .components import Hole

def beginning_of_text():
    return f"""
    Provide your suggestion for the {Hole}, either as a good introduction or a revision of the existing text, as a substring of the ideal passage:
    Sure! A substring of the ideal passage is:
    """

def middle_of_text():
    return f"""
    Provide your revision or suggestion for the {Hole} as a substring of the ideal passage:
    Sure! A substring of the ideal passage is:
    """

def end_of_text():
    return f"""
    Provide your revision or prediction for the {Hole} as a substring of the ideal passage:
    Sure! A substring of the ideal passage is:
    """

def PredictOutput(before: str, after: str) -> str:
    if len(before) == 0:
        return beginning_of_text()
    elif len(after) == 0:
        return end_of_text()
    else:
        return middle_of_text()
