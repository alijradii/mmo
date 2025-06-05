from persona.memory.memory_store import MemoryManager
from persona.memory.memory_utils import load_initial_memories
from typing import List

from dotenv import load_dotenv

load_dotenv()

memory_manager = MemoryManager()

memory_manager.memories = load_initial_memories("memories/personas")
number_of_created_memories = len(memory_manager.memories)

assert number_of_created_memories > 0
print(f"created {number_of_created_memories} memories")

memory_manager.save_to_disk("memories")
