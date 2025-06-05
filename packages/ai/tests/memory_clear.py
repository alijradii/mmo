from persona.memory.memory_store import MemoryManager

from dotenv import load_dotenv

load_dotenv()

memory_manager = MemoryManager()

memory_manager.memories = []
memory_manager.save_to_disk(path="memories")