Hole: str = "{{HOLE}}"

def PassageToRevise(before: str = "", after: str = "", tag: str = "to-revise") -> str:
    return f"""
    <passage-{tag}>
    {before}{Hole}{after}
    </passage-{tag}>
    """