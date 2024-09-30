STOP_WORDS: list[str] = [
    "the",
    "and",
    "but",
    "or",
    "for",
    "nor",
    "on",
    "at",
    "to",
    "from",
]

def remove_stop_words(writing_samples: list[str]) -> list[str]:
    for sample in writing_samples:
        for stop_word in STOP_WORDS:
            sample = sample.replace(stop_word, "")
    return writing_samples
