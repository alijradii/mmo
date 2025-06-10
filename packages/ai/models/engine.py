import asyncio
from models.world_manager import WorldManager
from models.game_state.world import WorldModel


class Engine:
    def __init__(self, world_manager: WorldManager, interval: float = 1.0):
        self.world_manager = world_manager
        self.interval = interval
        self._task = None
        self._running = False

    def start(self):
        if not self._running:
            self._running = True
            self._task = asyncio.create_task(self._run())
            print("[GameLoopManager] Started game loop.")

    def stop(self):
        if self._task and not self._task.done():
            self._task.cancel()
            self._running = False
            print("[GameLoopManager] Stopped game loop.")

    async def _run(self):
        try:
            while True:
                await asyncio.sleep(self.interval)
                self.update_worlds()
        except asyncio.CancelledError:
            print("[GameLoopManager] Loop cancelled.")

    def update_worlds(self):
        for room_id, world in self.world_manager.worlds.items():
            self.update_room(room_id, world)

    def update_room(self, room_id: str, world: WorldModel):
        print(f"[{room_id}] Tick: {getattr(world, 'tick', 'n/a')}")
        for entity_id, entity in world.entities.items():
            if entity.entityType == "NPC":
                print(f"  NPC {entity.username} at ({entity.x}, {entity.y}) [HP: {entity.HP}]")
