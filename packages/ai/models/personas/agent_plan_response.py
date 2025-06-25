from pydantic import BaseModel

class AgentPlanResponse(BaseModel):
    action: str
    context: str