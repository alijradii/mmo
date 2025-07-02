import asyncio
from models.world_manager import WorldManager
from models.game_state.world import WorldModel
from persona.memory.memory_store import MemoryManager

from typing import Optional, Dict
from fastapi import WebSocket
from collections import deque
from models.agent import Agent
from models.goap.goap_agent_state import AgentState

from db.db import get_db

from models.personas.conversation import Conversation


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
                context=agent_data["context"],
                memory_manager=self.memory_manager,
                engine=self,
            )

        return self.agents[id]

    async def handle_event(self, event):
        if event.get("event") == "chat":
            await self.handle_chat(event)
        elif event.get("event") == "agent_goap":
            await self.handle_goap_agent(event)

    async def handle_chat(self, event):
        # print(event)

        sender_entity = self.world_manager.get_entity(event.get("sender"))
        receiver_entity = self.world_manager.get_entity(event.get("receiver"))

        receiver_agent = await self.get_agent(receiver_entity.id)

        receiver_agent.short_term_memory.add_convo(
            conversation=Conversation(
                sender=sender_entity.username,
                sender_status="ally",
                content=event["content"],
            )
        )

        action = receiver_agent.generate_goal()

        print(action)

        if action.dialogue and len(action.dialogue) > 0:
            receiver_agent.short_term_memory.add_convo(
                conversation=Conversation(
                    sender=receiver_entity.username,
                    sender_status="self",
                    content=action.dialogue,
                )
            )

        await self.websocket.send_json(
            {
                "type": "action",
                "room_id": receiver_entity.room_id,
                "entity_id": receiver_entity.id,
                "action": action.action,
                "dialogue": action.dialogue,
                "target_id": action.target_id,
                "count": action.count,
                "subject": action.subject,
            }
        )

    async def handle_goap_agent(self, event):
        # print(event)
        data = event.get("data")
        npc_id = event.get("id")
        agent_state = AgentState(**data)

        # print(f"[GOAP] Received agent state for NPC {npc_id}")
        # print(f"Current Goal: {agent_state.current_goal}")
        # print(f"Goals: {[g.name for g in agent_state.goals]}")
        # print(f"World State: {agent_state.world_state}")
