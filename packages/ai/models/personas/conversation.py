from pydantic import BaseModel

class Conversation(BaseModel):
    sender: str
    sender_status: str
    content: str

    def __repr__(self):
        return f'{self.sender} ({self.sender_status}): {self.content}'