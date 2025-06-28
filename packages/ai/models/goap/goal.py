from pydantic import BaseModel
from typing import Dict, Any


class Goal(BaseModel):
    name: str
    desired_state: Dict[str, Any]
