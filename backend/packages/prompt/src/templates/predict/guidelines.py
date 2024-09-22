MimicToneAndStyle: str = """
Mimic the tone and style of the existing text in your suggestion.
"""

NoEllipsis: str = """
Do not use ellipsis (...) in your suggestion.
"""

def beginning_of_text() -> str:
    return f"""
    Guidelines:
    1. Ensure your suggestion matches the tone and style of the existing text.
    2. {NoEllipsis}
    3. {MimicToneAndStyle}
    """

def middle_of_text() -> str:
    return f"""
    Guidelines:
    1. Identify any lack of clarity, grammatical issues, or disconnects between the two parts.
    2. If multiple options are viable, choose the most natural-sounding suggestion.
    3. Double-check that your suggestion flows smoothly.
    4. {NoEllipsis}
    5. {MimicToneAndStyle}
    """

def end_of_text() -> str:
    return f"""
    Guidelines:
    1. Avoid unnecessary information or meaning changes.
    2. {NoEllipsis}
    3. {MimicToneAndStyle}
    """

def SuggestGuidelines(before: str, after: str) -> str:
    if len(before) == 0:
        return beginning_of_text()
    elif len(after) == 0:
        return end_of_text()
    else:
        return middle_of_text()
