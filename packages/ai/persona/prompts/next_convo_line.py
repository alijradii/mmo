from persona.memory.memory_store import MemoryManager
from utils.chat_completion import chat_completion


def next_convo_line(
    subject: str,
    memory_manager: MemoryManager,
    personality_traits: str,
    current_conversation: str,
) -> str:

    prompt = f"""
    Predict how would {subject} respond in the following conversation.

    Current conversation
    {current_conversation}
    """

    response = chat_completion(messages=[{"role": "user", "content": prompt}])
    return response
