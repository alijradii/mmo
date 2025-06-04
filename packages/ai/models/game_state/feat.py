from pydantic import BaseModel

class Feat(BaseModel):
    name: str
    cooldown: int
    cooldownEndTime: int
    castingDuration: int
    isCasting: bool
    isReady: bool