OnlyAFewWordsOfPadding: str = "The author will have trouble locating where to implement your suggestion. Sorround your suggestion with words from the author's text to help them locate where to implement your suggestion:"

def beginning_of_text():
    return """
    Provide the introduction to the passage. {OnlyAFewWordsOfPadding}:
    """

def middle_of_text():
    return """
    Provide your revision or suggestion for the passage. {OnlyAFewWordsOfPadding}:
    """

def end_of_text():
    return """
    Provide your revision or prediction for the passage. {OnlyAFewWordsOfPadding}:
    """

def SuggestOutput(before: str, after: str) -> str:
    if len(before) == 0:
        return beginning_of_text()
    elif len(after) == 0:
        return end_of_text()
    else:
        return middle_of_text()
