from pydantic import BaseModel

class AgentActionResponse(BaseModel):
    action: str
    dialogue: str
    target_id: str
    count: int
    subject: str