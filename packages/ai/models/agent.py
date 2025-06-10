from typing import List
from pydantic import BaseModel, Field
from models.game_state.entity import Entity

class Agent(BaseModel):
    id: str = Field(default="")
    name: str
    personality_traits: List[str] = Field(default_factory=list)
    entity: Entity

    def __init__(self, **data):
        super().__init__(**data)