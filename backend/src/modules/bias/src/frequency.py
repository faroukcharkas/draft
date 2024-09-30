# external
import tiktoken

def get_token_frequency(writing_samples: list[str]) -> dict[int, int]:
    enc = tiktoken.encoding_for_model("gpt-4o")
    all_samples = " ".join(writing_samples)
    tokens = enc.encode(all_samples)
    frequency = {}
    for token in tokens:
        if token in frequency:
            frequency[token] += 1
        else:
            frequency[token] = 1
    return frequency

def get_word_count(writing_samples: list[str]) -> int:
    return sum([len(sample.split()) for sample in writing_samples])

def take_top_n_tokens(token_frequency: dict[int, int], n: int) -> dict[int, int]:
    # Sort the tokens by their bias, and return the top n
    sorted_tokens = sorted(token_frequency.items(), key=lambda x: x[1], reverse=True)
    return {token: bias for token, bias in sorted_tokens[:n]}

