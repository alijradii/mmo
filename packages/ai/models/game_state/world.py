from typing import Dict, Optional
from models.game_state.game_state import GameState
from models.game_state.entity import Entity
from models.game_state.game_object import GameObject

class WorldModel:
    def __init__(self, id: str):
        self.id = id
        self.entities: Dict[str, Entity] = {}
        self.players: Dict[str, Entity] = {}
        self.projectiles: Dict[str, GameObject] = {}

    def update(self, data: dict):
        state = GameState(**data)
        self.entities = state.entities
        self.players = state.players

        for entity in self.entities.values():
            entity.room_id = self.id

        for player in self.players.values():
            player.room_id = self.id

        self.entities = self.entities | self.players
        self.tick = state.tick

    def get_entity(self, entity_id: str) -> Optional[Entity]:
        return self.entities.get(entity_id)
