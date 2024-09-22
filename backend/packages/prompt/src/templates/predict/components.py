def PassageToRevise(before: str = "", after: str = "", tag: str = "to-revise") -> str:
    return f"""
    <passage-{tag}>
    {before}{after}
    </passage-{tag}>
    """