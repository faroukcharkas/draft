MimicToneAndStyle: str = """Mimic the tone and style of the existing text in your suggestion."""

NoEllipsis: str = """Do not use ellipsis (...) in your suggestion."""

def SuggestGuidelines() -> str:
    return f"""
    Guidelines:
    1. Avoid unnecessary information or meaning changes.
    2. {NoEllipsis}
    3. {MimicToneAndStyle}
    4. Predict at a maximum of 10 words.
    """
