from typing import List, TYPE_CHECKING
from pydantic import BaseModel, Field
from models.game_state.entity import Entity

if TYPE_CHECKING:
    from models.world_manager import WorldManager

class Agent(BaseModel):
    id: str = Field(default="")
    name: str
    personality_traits: List[str] = Field(default_factory=list)
    entity: Entity
    world_manager: "WorldManager"

    def __init__(self, world_manager: "WorldManager", **data):
        super().__init__(**data)
        self._world_manager = world_manager