from pydantic import BaseModel, Field

class GameObject(BaseModel):
    id: str = Field(default="")
    x: float = 0
    y: float = 0
    z: float = 0
    xVelocity: float = 0
    yVelocity: float = 0
    zVelocity: float = 0
    width: float = 0
    height: float = 0
