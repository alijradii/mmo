from persona.memory.memory_store import MemoryManager

from dotenv import load_dotenv

load_dotenv()

memory_manager = MemoryManager()

memory_manager.load_from_disk("memories")
print("retrieved: ", len(memory_manager.memories))


akatsuki = memory_manager.retrieve_memories("akatsuki", "did shiroe aniticipate the ambush", 4)

for (mem, score) in akatsuki:
    print(mem.description)