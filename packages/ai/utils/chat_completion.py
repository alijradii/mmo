from typing import List
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI()


def chat_completion(messages: List[str]):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
    )

    return response
