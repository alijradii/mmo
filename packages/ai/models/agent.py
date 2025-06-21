from typing import List, TYPE_CHECKING
from models.game_state.entity import Entity
from models.personas.agent_plan_response import AgentPlanResponse

from persona.memory.short_term_memory import ShortTermMemory

if TYPE_CHECKING:
    from persona.memory.memory_store import MemoryManager

from persona.prompts.infer_persona_relationship import infer_persona_relationship
from utils.chat_completion import chat_structured_output


class Agent:
    def __init__(
        self,
        memory_manager: "MemoryManager",
        id: str = "",
        name: str = "",
        personality_traits: List[str] = None,
        entity: Entity = None,
    ):
        self.id = id
        self.name = name
        self.personality_traits = (
            personality_traits if personality_traits is not None else []
        )
        self.entity = entity

        self.memory_manager = memory_manager

        self.short_term_memory = ShortTermMemory()

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

        print("number of tokens: ", len(prompt.split()))
        print(prompt)
        print("\n\n")

        response = chat_structured_output(
            messages=[{"role": "user", "content": prompt}],
            response_format=AgentPlanResponse,
        ).parsed

        return response

    def get_agent_traits(self):
        return "\n".join(self.personality_traits)
