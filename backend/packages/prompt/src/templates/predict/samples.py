def Sample(sample: str) -> str:
    return f"<Sample>{sample}</Sample>\n"

def PredictSamples(samples: list[str]) -> str:
    sample_str = ""
    for sample in samples:
        sample_str += Sample(sample)
    return f"""
    The author has written the following samples. Use any relevent information and mimic the style of the author:
    {sample_str}
    """