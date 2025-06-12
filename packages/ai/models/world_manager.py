from typing import Dict, Optional

from models.game_state.entity import Entity
from models.game_state.world import WorldModel

class WorldManager:
    def __init__(self):
        self.worlds: Dict[str, WorldModel] = {}

    def update_world(self, room_id: str, data: dict):
        if room_id not in self.worlds:
            self.worlds[room_id] = WorldModel(room_id)
        self.worlds[room_id].update(data)

    def get_world(self, room_id: str) -> WorldModel:
        return self.worlds[room_id]

    def get_entity(self, entity_id: str) -> Optional[Entity]:
        for _, world in self.worlds.items():
            if entity := world.get_entity(entity_id):
                return entity

        return None