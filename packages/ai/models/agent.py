from typing import List, TYPE_CHECKING
from models.game_state.entity import Entity

from persona.memory.short_term_memory import ShortTermMemory

if TYPE_CHECKING:
    from persona.memory.memory_store import MemoryManager

from persona.prompts.infer_persona_relationship import infer_persona_relationship
from utils.chat_completion import chat_completion


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

    def decide_next_step(self) -> str:
        prompt = f"""
        You are {self.name}, a character inside the fantasy world of the game Elder Tale.
        Below are the general traits about your character:
        {self.get_agent_traits()}

        """

        if self.short_term_memory.has_conversation():
            prompt += f"""Here's an overview of the conversation {self.name} just had: 
            {self.short_term_memory.get_conversation()}

            """

            topic = self.short_term_memory.get_conversation_topic()
            memories = self.memory_manager.retrieve_memories(self.name, topic, 3)
            memories_str = "\n".join([memory.description for (memory, _) in memories])

            prompt += f"{self.name} knows the information below:\n{memories_str}\n"

        prompt += """ 
        Respond with a JSON object containing only the following:
            
        {
        "action": "<What will you do now in the world>",
        "dialogue": "<Optional in-character response line to speak aloud, or empty string if she says nothing>"
        }

        The output will be directly used to drive your next action in-game.
        """

        print("number of tokens: ", len(prompt.split()))
        print(prompt)
        print("\n\n")

        response = chat_completion(messages=[{"role": "user", "content": prompt}])

        return response

    def get_agent_traits(self):
        return "\n".join(self.personality_traits)
