from pydantic import BaseModel, Field
from typing import Literal, Any
from uuid import UUID, uuid4
from datetime import datetime
from utils.queries import get_vector_embedding


class ConceptNode(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    type: Literal["thought", "event", "chat"]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_accessed: datetime = Field(default_factory=datetime.utcnow)

    description: str
    embedding: list[float]
    importance: float

    depth: int

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

def create_concept_node(
    type: Literal["thought", "event", "chat"],
    description: str,
    importance: float,
    depth: int,
    subject: str,
    object: str,
    filling: dict[str, Any] = None,
    created_at: datetime = None,
    last_accessed: datetime = None,
) -> ConceptNode:
    embedding = get_vector_embedding(description)
    
    return ConceptNode(
        type=type,
        description=description,
        embedding=embedding,
        importance=importance,
        depth=depth,
        subject=subject,
        object=object,
        filling=filling or {},
        created_at=created_at or datetime.utcnow(),
        last_accessed=last_accessed or datetime.utcnow(),
    )