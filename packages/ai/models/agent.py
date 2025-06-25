from typing import List, TYPE_CHECKING
from models.game_state.entity import Entity
from models.personas.agent_plan_response import AgentPlanResponse
from models.personas.agent_action_response import AgentActionResponse

from persona.memory.short_term_memory import ShortTermMemory

if TYPE_CHECKING:
    from persona.memory.memory_store import MemoryManager
    from models.engine import Engine

from persona.prompts.infer_persona_relationship import infer_persona_relationship
from persona.prompts.in_game_actions import in_game_actions

from utils.chat_completion import chat_structured_output


class Agent:
    def __init__(
        self,
        memory_manager: "MemoryManager",
        id: str = "",
        name: str = "",
        personality_traits: List[str] = None,
        engine: "Engine" = None
    ):
        self.id = id
        self.name = name
        self.personality_traits = (
            personality_traits if personality_traits is not None else []
        )

        self.memory_manager = memory_manager

        self.short_term_memory = ShortTermMemory(self.name)

        self.engine = engine

    def infer_relationship(self, target_id):
        return infer_persona_relationship(
            subject=self.id, object=target_id, memory_manager=self.memory_manager
        )

    def plan(self) -> AgentPlanResponse:
        relevant_long_term_memories = self.memory_manager.retrieve_memories(
            self.id, self.short_term_memory.conversation_topic, 4
        )
        long_term_snippet = "\n".join(
            [m[0].description for m in relevant_long_term_memories]
        )

        prompt = (
            f"You are {self.name}, a character in a fantasy MMO.\n"
            + "Here is an overview of your recent conversations:\n"
            + self.short_term_memory.get()
            + "\nHere are some of your relevant long term memories:\n"
            + long_term_snippet
            + "\nHere are the items in your inventory, you don't have any other items: []"
            + "\nReturn an object describing what will you do next, with action being "
            + "the action that you will take (as a sentence), and dialogue being what you will say next, "
            + "and the context of the situation that you're currently in."
            + "If you don't want to say anything, return an empty str for dialogue."
        )

        response = chat_structured_output(
            messages=[{"role": "user", "content": prompt}],
            response_format=AgentPlanResponse,
        ).parsed

        return response

    def generate_action(self, plan: AgentPlanResponse) -> AgentActionResponse:
        entities = self.get_nearby_entities()
        print(entities)

        self_entity = self.get_entity()

        nearby_entities = "\n".join([x.get_repr() for x in entities])
        inventory_items = []

        prompt = (
            f"You are {self.name}, a character in a fantasy MMO.\n" 
            + f"Here's the situation that you are currently in: {plan.context}\n"
            + f"Here is the action that you were planning to take: {plan.action}\n"
            + f"Nearby entities: {nearby_entities}\n"
            + f"Inventory (you don't have any other items): {inventory_items}\n"
            + f"Your Feats: {self_entity.feats}\n"
            + "Below is the list of the actions that you can take: "
            + in_game_actions
            + "Decide on the next action that you're going to take.\n"
            + "Dialog is an optional string that your character will say.\n"
            + "Fill in the fields as required.\n"
        )

        print("number of tokens: ", len(prompt.split()))
        print(prompt)
        print("\n\n")

        response = chat_structured_output(
            messages=[{"role": "user", "content": prompt}],
            response_format=AgentActionResponse,
        ).parsed

        print("\n")
        print(response)

        return response

    def get_agent_traits(self):
        return "\n".join(self.personality_traits)

    def get_entity(self):
        if not self.engine:
            return None

        return self.engine.world_manager.get_entity(self.id)

    def get_nearby_entities(self) -> List[Entity]:
        if not self.engine:
            return []

        return self.engine.world_manager.get_nearby_entities(self.id)
