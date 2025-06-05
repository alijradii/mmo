from persona.memory.memory_store import MemoryManager
from persona.prompts.infer_persona_relationship import infer_persona_relationship

from dotenv import load_dotenv

load_dotenv()

memory_manager = MemoryManager()

memory_manager.load_from_disk("memories")

relationship = infer_persona_relationship(
    subject="akatsuki", object="shiroe", memory_manager=memory_manager
)

print(relationship)