# internal
from .src.frequency import get_token_frequency, get_word_count

BIAS_SENSITIVITY: float = 0.5

class BiasModule:
    @staticmethod
    def calculate_bias(writing_samples: list[str]) -> dict[int, float]:
        biases: dict[int, float] = {}
        word_count: int = get_word_count(writing_samples)
        token_frequencies: dict[int, int] = get_token_frequency(writing_samples)
        for token, frequency in token_frequencies.items():
            biases[token] = (frequency / word_count) * BIAS_SENSITIVITY
        return biases