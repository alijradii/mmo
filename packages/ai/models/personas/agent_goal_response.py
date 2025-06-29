from typing import Dict, Optional
from pydantic import BaseModel


class AgentGoalResponse(BaseModel):
    name: str
    description: str

    desired_world_state: Dict[str, bool] = {}
    terminate_world_state: Dict[str, bool] = {}

    dialogue: Optional[str]
