from persona.memory.memory_store import MemoryManager

from dotenv import load_dotenv

from models.agent import Agent
from models.personas.conversation import Conversation

load_dotenv()

memory_manager = MemoryManager()

memory_manager.load_from_disk("memories")
print("retrieved: ", len(memory_manager.memories))

agent = Agent(
    id="akatsuki",
    name="akatsuki",
    personality_traits=[],
    entity=None,
    memory_manager=memory_manager,
)

conversation = [
    Conversation(sender="Akatsuki", sender_status="self", content="Shiroe, I’ve secured the rooftop. No enemies in sight."),
    Conversation(sender="Shiroe", sender_status="ally", content="Good work. Hold position and monitor the plaza below."),
    Conversation(sender="Akatsuki", sender_status="self", content="Understood. Do you want me to follow the suspicious player I spotted earlier?"),
    Conversation(sender="Shiroe", sender_status="ally", content="Not yet. Let's gather more information before making a move."),
]

agent.short_term_memory.conversations = conversation
agent.short_term_memory.conversation_topic = "Akatsuki is keeping an eye on the rooftops after reports of suspicious activity of the merchant guilds"

response = agent.decide_next_step()
print(response)