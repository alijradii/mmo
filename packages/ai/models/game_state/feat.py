from datetime import datetime
from pydantic import BaseModel


class Feat(BaseModel):
    name: str
    cooldown: int
    cooldownEndTime: int
    castingDuration: int
    isCasting: bool
    isReady: bool
    category: str

    def time_remaining(self) -> int:
        now = int(datetime.utcnow().now().timestamp() * 1000)
        remaining = self.cooldownEndTime - now
        return remaining // 1000 if remaining > 0 else 0

    def __repr__(self):
        if self.isReady:
            status = "ready"
        else:
            status = f"ready in {self.time_remaining()}s"

        return f"<Feat: name={self.name}, category={self.category}, status={status}>"
