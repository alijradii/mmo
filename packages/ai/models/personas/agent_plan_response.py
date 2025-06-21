from pydantic import BaseModel

class AgentPlanResponse(BaseModel):
    action: str
    dialogue: str
    context: str