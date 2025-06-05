import os
from typing import List
from datetime import datetime

from persona.memory.concept_node import ConceptNode
from persona.memory.concept_node import create_concept_node


def init_memories_from_persona_description(
    subject: str, description: str
) -> List[ConceptNode]:
    memories: List[ConceptNode] = []

    for memory in description.split("\n"):
        concept_node = create_concept_node(
            type="thought",
            description=memory,
            created_at=datetime.now(),
            depth=1,
            importance=0.7,
            subject=subject,
            object="initial memories",
        )

        memories.append(concept_node)

    return memories


def load_initial_memories(directory_path: str) -> List[ConceptNode]:
    """
    Loads initial memory files from a directory.

    Each file must:
    - Have no extension
    - Contain plain text (description of the subject)
    """
    memories = []

    for filename in os.listdir(directory_path):
        filepath = os.path.join(directory_path, filename)

        if not os.path.isfile(filepath) or "." in filename:
            continue

        with open(filepath, "r", encoding="utf-8") as file:
            content = file.read().strip()

        memories.extend(init_memories_from_persona_description(filename, content))

    return memories
