from typing import List
from openai import OpenAI
client = OpenAI()

def get_vector_embedding(query: str) -> List[float]:
    return client.embeddings.create(
        input="Your text string goes here",
        model="text-embedding-3-small"
    ).data[0].embedding
