from .components import PassageToRevise

def beginning_of_text(after: str) -> str:
    if len(after) == 0:
        return """
        What's a good start to a passage?
        """
    else:
        return """
        Come up with a good start for the passage:
        """

def end_of_text(before: str) -> str:
    return f"""
    Here is the passage that you are tasked with predicting the next sentence for:
    {PassageToRevise(before=before, tag="to-predict-next-sentence-for")}
    """

def middle_of_text(before: str, after: str) -> str:
    return f"""
    Here is the passage that you are tasked with revising:
    {PassageToRevise(before=before, after=after, tag="to-revise")}
    """

def SuggestInput(before: str, after: str) -> str:
    if len(before) == 0:
        return beginning_of_text(after)
    elif len(after) == 0:
        return end_of_text(before)
    else:
        return middle_of_text(before, after)
