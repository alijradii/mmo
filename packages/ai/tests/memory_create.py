from persona.memory.memory_store import MemoryManager
from persona.memory.concept_node import ConceptNode, create_concept_node
from typing import List

from dotenv import load_dotenv

load_dotenv()

memory_manager = MemoryManager()

def generate_elder_tale_memories() -> List[ConceptNode]:
    memories = []

    # Subject: npc_akatsuki (an Assassin)
    memories += [
        create_concept_node(
            type="event",
            description="Akatsuki shadowstepped behind a goblin scout.",
            importance=0.7,
            depth=0,
            subject="akatsuki",
            object="goblin_scout",
            filling={"location": "Forest of Eternal Twilight", "emotion": "focus"},
        ),
        create_concept_node(
            type="thought",
            description="Akatsuki considered whether Shiroe anticipated the ambush.",
            importance=0.9,
            depth=1,
            subject="akatsuki",
            object="shiroe_ambush_thought",
            filling={"emotion": "curiosity"},
        ),
        create_concept_node(
            type="chat",
            description="Akatsuki whispered, 'The path is clear.'",
            importance=0.5,
            depth=0,
            subject="akatsuki",
            object="party_chat",
            filling={"channel": "team", "emotion": "calm"},
        ),
    ]

    # Subject: npc_naotsugu (a Guardian)
    memories += [
        create_concept_node(
            type="event",
            description="Naotsugu blocked a Dire Fang's charge with his shield.",
            importance=0.8,
            depth=0,
            subject="naotsugu",
            object="dire_fang",
            filling={"location": "Abandoned Mine", "emotion": "bravery"},
        ),
        create_concept_node(
            type="thought",
            description="Naotsugu thought the party was getting stronger together.",
            importance=0.6,
            depth=1,
            subject="naotsugu",
            object="team_growth",
            filling={"emotion": "pride"},
        ),
        create_concept_node(
            type="chat",
            description="Naotsugu shouted, 'Leave the tanking to me!'",
            importance=0.5,
            depth=0,
            subject="naotsugu",
            object="battle_shout",
            filling={"channel": "local", "emotion": "confidence"},
        ),
    ]

    return memories

memories = generate_elder_tale_memories() 

# save memories

for mem in memories:
    memory_manager.add_memory(mem)

memory_manager.save_to_disk("memories")
