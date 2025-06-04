from pydantic import BaseModel
from typing import Dict
from models.game_state.entity import Entity

class GameState(BaseModel):
    players: Dict[str, Entity]
    entities: Dict[str, Entity]
    projectiles: Dict
    tick: int
