from typing import List, Optional, Dict, Any

from models.goap.goal import Goal
from models.goap.action import Action
from pydantic import BaseModel

class AgentState(BaseModel):
    current_goal: Optional[Goal]
    goals: List[Goal]
    actions: List[Action]
    world_state: Dict[str, Any]