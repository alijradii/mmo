from typing import List, TYPE_CHECKING

from models.game_state.entity import Entity

from models.personas.agent_plan_response import AgentPlanResponse
from models.personas.agent_goal_response import AgentGoalResponse
from models.personas.agent_action_response import AgentActionResponse
from models.personas.agent_goap_context import AgentGoapContext

from persona.memory.short_term_memory import ShortTermMemory

if TYPE_CHECKING:
    from persona.memory.memory_store import MemoryManager
    from models.engine import Engine

from persona.prompts.infer_persona_relationship import infer_persona_relationship
from persona.prompts.in_game_actions import in_game_actions
from persona.prompts.goap_output_format import goap_output_format
from persona.prompts.world_state_variables import world_state_variables

from utils.chat_completion import chat_structured_output, chat_agent_goal_response


class Agent:
    def __init__(
        self,
        memory_manager: "MemoryManager",
        id: str = "",
        name: str = "",
        personality_traits: List[str] = None,
        engine: "Engine" = None,
        context: str = "",
    ):
        self.id = id
        self.name = name
        self.personality_traits = (
            personality_traits if personality_traits is not None else []
        )

        self.memory_manager = memory_manager

        self.short_term_memory = ShortTermMemory(self.name)

        self.engine = engine
        self.context = context

    def infer_relationship(self, target_id):
        return infer_persona_relationship(
            subject=self.id, object=target_id, memory_manager=self.memory_manager
        )

    def plan(self) -> AgentGoapContext:
        relevant_long_term_memories = self.memory_manager.retrieve_memories(
            self.id, self.short_term_memory.conversation_topic, 3
        )
        long_term_snippet = "\n".join(
            [m[0].description for m in relevant_long_term_memories]
        )

        self_entity = self.get_entity()

        prompt = (
            f"You are {self.name}, a character in a fantasy MMO.\n"
            + f"Here are some of your character traits\n{self.personality_traits}\n"
            + f"Here is the current context of the situation you're in: {self.context}\n"
            + "Here are some of your relevant memories:\n"
            + long_term_snippet
            + "\nHere is an overview of your recent observations:\n"
            + self.short_term_memory.get()
            + "\nReturn an object describing the context of your current situations"
            + " with the action that that you're planning to take, and the replan conditions being the conditions "
            + "that will make your revaluate your plan."
        )

        print("number of tokens: ", len(prompt.split()))
        print(prompt)
        print("\n\n")

        response = chat_structured_output(
            messages=[{"role": "user", "content": prompt}],
            response_format=AgentGoapContext,
        ).parsed

        return response

    def generate_action(self, plan: AgentPlanResponse) -> AgentActionResponse:
        entities = self.get_nearby_entities()

        self_entity = self.get_entity()

        nearby_entities = "\n".join([x.get_repr() for x in entities])
        feats = "\n".join([feat.__repr__() for feat in self_entity.feats])

        inventory_items = []

        prompt = (
            f"You are {self.name}, a character in a fantasy MMO.\n"
            + f"Here's the situation that you are currently in: {plan.context}\n"
            + f"Here is the action that you were planning to take: {plan.action}\n"
            + f"Nearby entities: \n{nearby_entities}\n"
            + f"Inventory (you don't have any other items): {inventory_items}\n"
            + f"Your Skills: \n{feats}\n"
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

        return response

    def generate_goal(self, goap_context: AgentGoapContext) -> AgentGoalResponse:
        entities = self.get_nearby_entities()

        self_entity = self.get_entity()

        nearby_entities = "\n".join([x.get_repr() for x in entities])
        # feats = "\n".join([feat.__repr__() for feat in self_entity.feats])

        prompt = (
            f"You are {self.name}, a character in a fantasy MMO.\n"
            + f"Here's the situation that you are currently in: {goap_context.context}\n"
            + f"Here's a list of the action that we planning to take: {goap_context.action}\n"
            + f"Here's a list of your replan conditions: {goap_context.replan_conditions}\n"
            + "\nHere is an overview of your recent observations:\n"
            + self.short_term_memory.get()
            + f"\nYour entity: {self_entity.get_repr()}\n"
            + f"Nearby entities: \n{nearby_entities}\n"
            + "Translate action and conditions into an in game goal that can be understood by a GOAP system."
            + "Create your desired and terminate world states from the following variables, only these variables:\n"
            + world_state_variables
            + "\nOutput a goal with the following format\n"
            + goap_output_format
        )

        print("number of tokens: ", len(prompt.split()))
        print(prompt)
        print("\n\n")

        response = chat_agent_goal_response(
            messages=[{"role": "user", "content": prompt}],
        )

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
