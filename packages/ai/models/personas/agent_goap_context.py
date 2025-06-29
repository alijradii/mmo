from typing import List
from pydantic import BaseModel

class AgentGoapContext(BaseModel):
    context: str
    action: str
    replan_conditions: List[str]