from typing import Dict, Optional, Any
from pydantic import BaseModel


class AgentGoalResponse(BaseModel):
    name: str
    description: str

    desired_world_state: Dict[str, Any] = {}
    terminate_world_state: Dict[str, Any] = {}

    dialogue: Optional[str]
