from typing import Dict
from models.game_state.game_state import GameState
from models.game_state.entity import Entity
from models.game_state.game_object import GameObject

class WorldModel:
    def __init__(self):
        self.entities: Dict[str, Entity] = {}
        self.players: Dict[str, Entity] = {}
        self.projectiles: Dict[str, GameObject] = {}

    def update(self, data: dict):
        state = GameState(**data)
        self.entities = state.entities
        self.players = state.players
        self.tick = state.tick
