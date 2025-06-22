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
    engine=None,
    memory_manager=memory_manager,
)

# conversation = [
#     Conversation(sender="Akatsuki", sender_status="self", content="Shiroe, I’ve secured the rooftop. No enemies in sight."),
#     Conversation(sender="Shiroe", sender_status="ally", content="Good work. Hold position and monitor the plaza below."),
#     Conversation(sender="Akatsuki", sender_status="self", content="Understood. Do you want me to follow the suspicious player I spotted earlier?"),
#     Conversation(sender="Shiroe", sender_status="ally", content="Not yet. Let's gather more information before making a move."),
# ]

# agent.short_term_memory.conversations = conversation
# agent.short_term_memory.conversation_topic = "Akatsuki is keeping an eye on the rooftops after reports of suspicious activity of the merchant guilds"


conversation = [
    Conversation(sender="Shiroe", sender_status="ally", content="Akatsuki... I just took a critical hit. My HP is in the red."),
    Conversation(sender="Akatsuki", sender_status="self", content="Hold on. I'm moving toward your position now."),
    Conversation(sender="Shiroe", sender_status="ally", content="Do you have any potions left in your inventory?"),
]

agent.short_term_memory.conversations = conversation
agent.short_term_memory.conversation_topic = "The Log Horizon guild is in the middle of an intense raid, shiroe is asking for akatsuki's assistance"

response = agent.plan()

action = agent.generate_action(response)
print(action)