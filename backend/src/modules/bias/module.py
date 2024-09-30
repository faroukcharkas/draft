# builtin
import math

# internal
from .src.frequency import get_token_frequency, get_word_count, take_top_n_tokens
from .src.words import remove_stop_words

BIAS_SENSITIVITY: float = 0.05

class BiasModule:
    @staticmethod
    def calculate_bias(writing_samples: list[str]) -> dict[int, float]:
        biases: dict[int, float] = {}
        writing_samples = remove_stop_words(writing_samples)
        word_count: int = get_word_count(writing_samples)
        token_frequencies: dict[int, int] = get_token_frequency(writing_samples)
        for token, frequency in token_frequencies.items():
            biases[token] = math.ceil((frequency / word_count) * BIAS_SENSITIVITY * 100)
        return take_top_n_tokens(biases, 25)
