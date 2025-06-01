from pydantic import BaseModel, Field
from typing import Literal, Any
from uuid import UUID, uuid4
from datetime import datetime


class ConceptNode(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    type: Literal["thought", "event", "chat"]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_accessed: datetime = Field(default_factory=datetime.utcnow)

    description: str
    embedding: list[float]  # e.g., 384-dimensional vector
    importance: float  # 0.0 to 1.0

    depth: int  # e.g., reflection depth

    subject: str
    object: str

    filling: dict[str, Any] = Field(default_factory=dict)

    class Config:
        json_schema_extra = {
            "example": {
                "type": "event",
                "description": "NPC saw the player draw a sword",
                "embedding": [0.001, 0.023, ...],  # truncated
                "importance": 0.8,
                "depth": 0,
                "subject": "npc_42",
                "object": "player_draw_sword",
                "filling": {
                    "location": "market",
                    "emotion": "fear"
                }
            }
        }
