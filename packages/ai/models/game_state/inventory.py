from pydantic import BaseModel
from typing import Dict


class Inventory(BaseModel):
    items: Dict[str, Dict]
    equipment: Dict[str, Dict]
    cols: int
    rows: int
