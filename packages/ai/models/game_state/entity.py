from typing import List, Dict, Optional
from models.game_state.feat import Feat
from models.game_state.game_object import GameObject
from models.game_state.inventory import Inventory

class Entity(GameObject):
    username: str
    entityType: str
    state: str
    direction: str
    LEVEL: int
    HP: int
    MP: int
    TEMP_HP: int
    appearance: Dict[str, str]
    baseStats: Dict[str, int]
    finalStats: Dict[str, int]
    bonuses: Dict = {}
    resistances: Dict = {}
    statusEffects: List = []
    feats: List[Feat] = []
    inventory: Inventory
    tick: int
    room_id: Optional[str] = ""
