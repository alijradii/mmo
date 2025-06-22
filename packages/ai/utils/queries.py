from typing import List
from openai import OpenAI

from dotenv import load_dotenv

load_dotenv()

client = OpenAI()

def get_vector_embedding(query: str) -> List[float]:
    return client.embeddings.create(
        input=query,
        model="text-embedding-3-small"
    ).data[0].embedding
