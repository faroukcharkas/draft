# external
from tiktoken import Tokenizer

def get_token_frequency(writing_samples: list[str]) -> dict[int, int]:
    tokenizer = Tokenizer()
    all_samples = " ".join(writing_samples)
    tokens = tokenizer.encode(all_samples)
    frequency = {}
    for token in tokens:
        if token in frequency:
            frequency[token] += 1
        else:
            frequency[token] = 1
    return frequency

def get_word_count(writing_samples: list[str]) -> int:
    return sum([len(sample.split()) for sample in writing_samples])
