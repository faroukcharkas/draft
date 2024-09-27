def end_of_text(before: str):
    return f"""
    Either predict the completion of the sentence, or predict the start of the next sentence.:
    {before}
    """

def SuggestOutput(before: str) -> str:
    return end_of_text(before)
