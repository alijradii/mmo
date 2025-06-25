from typing import List, Dict, Optional
from pydantic import Field
from models.game_state.feat import Feat
from models.game_state.game_object import GameObject
from models.game_state.inventory import Inventory

class Entity(GameObject):
    username: Optional[str] = Field(default="")
    entityType: str
    state: str
    direction: str
    LEVEL: int
    HP: int
    MP: int
    appearance: Dict[str, str]
    baseStats: Dict[str, int]
    finalStats: Dict[str, int]
    bonuses: Dict = Field(default_factory=dict)
    resistances: Dict = Field(default_factory=dict)
    statusEffects: List = Field(default_factory=list)
    feats: List[Feat] = Field(default_factory=list)
    inventory: Optional[Inventory] = None
    tick: int
    room_id: Optional[str] = Field(default="")

    def get_repr(self):
        return f"<id={self.id}, name='{self.username or self.entityType}', HP={self.HP}>"