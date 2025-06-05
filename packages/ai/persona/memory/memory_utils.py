from typing import List
from datetime import datetime

from persona.memory.concept_node import ConceptNode
from persona.memory.concept_node import create_concept_node


def init_memories_from_persona_description(
    subject: str, description: str
) -> List[ConceptNode]:
    memories: List[ConceptNode] = []

    for memory in description.split(";"):
        concept_node = create_concept_node(
            type="thought",
            description=memory,
            created_at=datetime.now(),
            depth=1,
            importance=0.7,
            subject=subject,
        )

        memories.append(concept_node)

    return memories
