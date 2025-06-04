from typing import Dict
from models.game_state.world import WorldModel

class WorldManager:
    def __init__(self):
        self.worlds: Dict[str, WorldModel] = {}

    def update_world(self, room_id: str, data: dict):
        if room_id not in self.worlds:
            self.worlds[room_id] = WorldModel()
        self.worlds[room_id].update(data)

    def get_world(self, room_id: str) -> WorldModel:
        return self.worlds[room_id]
