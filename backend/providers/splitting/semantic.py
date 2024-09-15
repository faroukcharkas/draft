# external
from semantic_text_splitter import TextSplitter
from tokenizers import Tokenizer

# internal
from .base import BaseSplittingProvider

class SemanticSplittingProvider(BaseSplittingProvider):
    def split(self, original_text: str) -> list[str]:
        tokenizer: Tokenizer = Tokenizer.from_pretrained("bert-base-uncased")
        splitter: TextSplitter = TextSplitter.from_huggingface_tokenizer(tokenizer, trim=True)
        chunks: list[str] = splitter.chunks(original_text)
        return chunks