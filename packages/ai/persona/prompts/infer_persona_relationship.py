from persona.memory.memory_store import MemoryManager
from utils.chat_completion import chat_completion


def infer_persona_relationship(
    subject: str, object: str, memory_manager: MemoryManager
) -> str:
    relevant_memories = memory_manager.retrieve_memories(
        subject=subject,
        query=f"What is {subject}'s relationship with {object}",
        top_k=4,
    )

    prompt = f"""
    Given the following memories of {subject},
    Output one brief sentence that describes the relationship between {subject} and {object} 
    """

    for mem, score in relevant_memories:
        prompt += f"({mem.type}) {mem.description}\n"

    response = chat_completion(messages=[{"role": "user", "content": prompt}])
    return response
