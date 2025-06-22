from pydantic import BaseModel

class AgentActionResponse(BaseModel):
    action: str
    dialogue: str
    target: str
    count: int