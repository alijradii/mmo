import os
from typing import List

from persona.memory.concept_node import ConceptNode
from persona.memory.concept_node import create_inferred_concept_node


def init_memories_from_persona_description(
    subject: str, description: str
) -> List[ConceptNode]:
    memories: List[ConceptNode] = []

    for memory in description.split("\n"):
        concept_node = create_inferred_concept_node(
            type="seed",
            description=memory,
            depth=1,
            subject=subject,
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