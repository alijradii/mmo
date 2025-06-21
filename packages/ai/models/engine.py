import asyncio
from models.world_manager import WorldManager
from models.game_state.world import WorldModel
from persona.memory.memory_store import MemoryManager

from typing import Optional, Dict
from fastapi import WebSocket
from collections import deque
from models.agent import Agent

from db.db import get_db

class Engine:
    def __init__(self, world_manager: WorldManager, interval: float = 1.0):
        self.world_manager = world_manager
        self.interval = interval
        self._task = None
        self._running = False

        self.event_queue = deque([])

        self.game_server: Optional[WebSocket]

        self.memory_manager = MemoryManager()
        self.memory_manager.load_from_disk("memories")

        self.agents: Dict[str, Agent] = {}

    def start(self):
        if not self._running:
            self._running = True
            self._task = asyncio.create_task(self._run())
            print("[GameLoopManager] Started game loop.")

    def stop(self):
        # self.memory_manager.save_to_disk("memories")

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

    def register_connection(self, websocket: WebSocket):
        self.websocket = websocket

    def update_worlds(self):
        for room_id, world in self.world_manager.worlds.items():
            self.update_room(room_id, world)

    def update_room(self, room_id: str, world: WorldModel):
        print(f"[{room_id}] Tick: {getattr(world, 'tick', 'n/a')}")

        for entity_id, entity in world.entities.items():
            if entity.entityType == "NPC":
                continue
                print(
                    f"  NPC {entity.username} at ({entity.x}, {entity.y}) [HP: {entity.HP}]"
                )

    async def get_agent(self, id: str) -> Agent:
        if not self.agents.get(id):
            db = get_db()
            agent_data = db["agents"].find_one({"_id": id}) 

            if not agent_data:
                raise Exception(f"Agent data not found for {id}")

            self.agents[id] = Agent(
                id=id,
                name=id,
                personality_traits=agent_data["traits"],
                entity=self.world_manager.get_entity(id),
                memory_manager = self.memory_manager
            )

        return self.agents[id]

    async def handle_event(self, event):
        print(event)
        if event.get("event") == "chat":
            await self.handle_chat(event)

    async def handle_chat(self, event):
        print(event)

        sender_entity = self.world_manager.get_entity(event.get("sender"))
        receiver_entity = self.world_manager.get_entity(event.get("receiver"))

        receiver_agent = await self.get_agent(receiver_entity.id)

        await self.websocket.send_json(
            {"message": f"{receiver_entity.username} received message from {sender_entity.username}"}
        )
