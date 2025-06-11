from typing import List
from models.game_state.entity import Entity

class Agent:
    def __init__(
        self,
        id: str = "",
        name: str = "",
        personality_traits: List[str] = None,
        entity: Entity = None,
    ):
        self.id = id
        self.name = name
        self.personality_traits = personality_traits if personality_traits is not None else []
        self.entity = entity
