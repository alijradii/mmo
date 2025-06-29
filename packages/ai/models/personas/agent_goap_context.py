from typing import List
from pydantic import BaseModel

class AgentGoapContext(BaseModel):
    context: str
    priorities: List[str]
    replan_conditions: List[str]