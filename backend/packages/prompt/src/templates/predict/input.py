from .components import PassageToRevise

def beginning_of_text(after: str) -> str:
    return f"""
    Here is the passage that you are tasked with revising as it pertains to a good introduction:
    {PassageToRevise(after=after)}
    """

def end_of_text(before: str) -> str:
    return f"""
    Here is the passage that you are tasked with predicting the next sentence for:
    {PassageToRevise(before=before, tag="to-predict-next-sentence-for")}
    """

def middle_of_text(before: str, after: str) -> str:
    return f"""
    Here is the passage that you are tasked with revising:
    {PassageToRevise(before=before, after=after)}
    """

def PredictInput(before: str, after: str) -> str:
    if len(before) == 0:
        return beginning_of_text(after)
    elif len(after) == 0:
        return end_of_text(before)
    else:
        return middle_of_text(before, after)
