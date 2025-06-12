from typing import List, TYPE_CHECKING
from models.game_state.entity import Entity

if TYPE_CHECKING:
    from persona.memory.memory_store import MemoryManager

from persona.prompts.infer_persona_relationship import infer_persona_relationship


class Agent:
    def __init__(
        self,
        memory_manager: "MemoryManager",
        id: str = "",
        name: str = "",
        personality_traits: List[str] = None,
        entity: Entity = None,
    ):
        self.id = id
        self.name = name
        self.personality_traits = (
            personality_traits if personality_traits is not None else []
        )
        self.entity = entity

        self.memory_manager = memory_manager

    def infer_relationship(self, target_id):
        return infer_persona_relationship(
            subject=self.id, object=target_id, memory_manager=self.memory_manager
        )
