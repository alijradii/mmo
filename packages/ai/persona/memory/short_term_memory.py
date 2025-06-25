from typing import List

from models.personas.conversation import Conversation
from utils.chat_completion import chat_completion


class ShortTermMemory:
    def __init__(self, name):
        self.name = name
        self.conversations: List[Conversation] = []
        self.conversation_topic: str = ""

    def has_conversation(self) -> bool:
        return len(self.conversations) > 0

    def get_conversation(self) -> str:
        return "\n".join([repr(c) for c in self.conversations[-8:]])

    def get_conversation_topic(self) -> str:
        return self.conversation_topic

    def add_convo(self, conversation: Conversation):
        self.conversations.append(conversation)

        if (len(self.conversations)) % 10 == 0 or self.conversation_topic == "":
            self.summarize_conversation_topic()

    def summarize_conversation_topic(self):
        prompt = f"""Summarize the following conversation that {self.name} is having with others.
        """

        if self.conversation_topic:
            prompt += f"\nThe previous topic of the conversation was {self.conversation_topic}"

        convo = "\n".join([repr(c) for c in self.conversations[-10:]])
        prompt += f"Here's the last few bits of the conversation\n {convo}"

        response = chat_completion(messages=[{"role": "user", "content": prompt}])

        self.conversation_topic = response

    def get(self):
        ans = ""

        if self.conversation_topic:
            ans += "Conversation overview: " + self.conversation_topic + "\n"

        ans += self.get_conversation()

        return ans
