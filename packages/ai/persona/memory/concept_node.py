from pydantic import BaseModel, Field
from typing import Literal, Any, Optional
from uuid import UUID, uuid4
from datetime import datetime
from utils.queries import get_vector_embedding
import json

from utils.chat_completion import chat_structured_output


class ConceptNode(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    type: Literal["thought", "event", "chat", "seed"]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_accessed: datetime = Field(default_factory=datetime.utcnow)

    description: str
    embedding: list[float]
    importance: float

    depth: int

    subject: str # what npc this memory is for
    object: str # place, person or thing that the memory is about

    filling: dict[str, Any] = Field(default_factory=dict) # optional additional information

    class Config:
        json_schema_extra = {
            "example": {
                "type": "event",
                "description": "NPC saw the player draw a sword",
                "embedding": [0.001, 0.023],  # truncated
                "importance": 0.8,
                "depth": 0,
                "subject": "npc_42",
                "object": "player_draw_sword",
                "filling": {"location": "market", "emotion": "fear"},
            }
        }

    def __str__(self):
        data = self.dict(exclude={"embedding"})
        return json.dumps(data, indent=2, default=str)

    def __repr__(self):
        return f"ConceptNode(type={self.type!r}, description={self.description!r}, subject={self.subject!r}, object={self.object!r}, importance={self.importance}, depth={self.depth})"


def create_concept_node(
    type: Literal["thought", "event", "chat", "seed"],
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


class InferredConceptNodeModel(BaseModel):
    type: Literal["event", "thought", "chat", "seed"]
    object: str
    importance: float = Field(..., ge=0.0, le=1.0)


def create_inferred_concept_node(
    description: str,
    depth: int,
    subject: str,
    type: Optional[Literal["thought", "event", "chat"]] = None,
    filling: Optional[dict[str, Any]] = None,
    created_at: Optional[datetime] = None,
    last_accessed: Optional[datetime] = None,
) -> ConceptNode:

    system_prompt = (
        "Infer the object (person, place, or thing the memory is about), "
        "a type that defines what the memory is 'chat' or 'thought' or 'event'"
        "a float importance score between 0 and 1, 0 for very mundane tasks, and 1 for life changing memories. "
        "Do not fabricate. Use your best guess from the input."
    )

    inferred = chat_structured_output(
        messages=[
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": f"""
        infer the required data for the following memory for subject {subject}

        memory: {description}
        """,
            },
        ],
        response_format=InferredConceptNodeModel,
    ).parsed

    print(inferred)
    embedding = get_vector_embedding(description)

    return ConceptNode(
        type=type or inferred.type,
        description=description,
        embedding=embedding,
        importance=inferred.importance,
        depth=depth,
        subject=subject,
        object=inferred.object,
        filling=filling or {},
        created_at=created_at or datetime.utcnow(),
        last_accessed=last_accessed or datetime.utcnow(),
    )
