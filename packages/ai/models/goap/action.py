from pydantic import BaseModel
from typing import Dict, Any


class Action(BaseModel):
    name: str
    effects: Dict[str, Any]
    preconditions: Dict[str, Any]
