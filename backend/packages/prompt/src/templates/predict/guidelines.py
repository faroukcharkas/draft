def mimic_tone_and_style() -> str:
    return """
    Mimic the tone and style of the existing text in your suggestion.
    """

def beginning_of_text() -> str:
    """
    Meant to be used when the author is stuck at the beginning of the text.
    """
    return f"""
    Guidelines:
    1. If the user's text already has a strong start, revise the text to improve clarity, flow, and style.
    2. If a beginning is needed, create a short, engaging sentence that leads into the user's text.
    3. Ensure your suggestion matches the tone and style of the existing text.
    4. Consider the context and subject matter when making your suggestion.
    5. {mimic_tone_and_style()}
    """

def middle_of_text() -> str:
    """
    Meant to be used when the author is stuck in the middle of the text.
    This should be only used if there's a lack of clarity or grammatical correctness in the text.

    For example:
    "I love cats. I wish I could take it outside."
    The AI should recognize this is an unclear sentence and should suggest "cats. I have one named Fluffy. I"
    """
    return f"""
    Guidelines:
    1. Identify any lack of clarity, grammatical issues, or disconnects between the two parts.
    2. If multiple options are viable, choose the most natural-sounding suggestion.
    3. Double-check that your suggestion flows smoothly.
    4. If the text is perfect, return a substring of the text.
    5. {mimic_tone_and_style()}
    """

def end_of_text() -> str:
    """
    Meant to be used when the author is stuck at the end of the text.

    For example:
    "My name is Johnathon, and I'm a student at _____."
    The AI should fill in with "student at Stanford University."
    The AI should ideally pad the suggestion with the actual user's text.
    """
    return f"""
    Guidelines:
    1. Match tone and style of existing text.
    2. Incorporate existing text for continuity if possible.
    3. Avoid unnecessary information or meaning changes.
    4. {mimic_tone_and_style()}
    """

def PredictGuidelines(before: str, after: str) -> str:
    if len(before) == 0:
        return beginning_of_text()
    elif len(after) == 0:
        return end_of_text()
    else:
        return middle_of_text()
