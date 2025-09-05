import { eventBus } from "@/game/eventBus/eventBus";
import { SkillUIData } from "@/game/eventBus/types";
import { useEffect, useState } from "react";

interface SkillSlotProps {
  skill: SkillUIData | null;
  index: number;
}

export const SkillSlot: React.FC<SkillSlotProps> = ({ skill, index }) => {
  const [cooldown, setCooldown] = useState<number>(0);

  useEffect(() => {
    if (!skill) return;

    const updateCooldown = () => {
      if (!skill.readyAt) {
        setCooldown(0);
        return;
      }

      const now = Date.now();
      const readyTime = new Date(skill.readyAt).getTime();
      const diff = Math.max(0, Math.ceil((readyTime - now) / 1000));
      setCooldown(diff);
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);

    return () => clearInterval(interval);
  }, [skill]);

  return (
    <div
      key={index}
      className="relative w-[50px] h-[50px] border border-slate-950 pointer-events-auto"
      onClick={() => {
        if (skill) eventBus.emit("use-skill", skill);
      }}
    >
      {skill ? (
        <div
          className={`w-full h-full relative ${
            skill.isReady ? "bg-red-500" : "bg-gray-500"
          } flex items-center justify-center`}
        >
          <div
            className="absolute w-full bg-slate-900 opacity-50 bottom-0 z-0"
            style={{
              height: `${Math.floor((cooldown * 100) / skill.cooldown)}%`,
            }}
          />

          {!skill.isReady && cooldown > 0 && (
            <span className="text-white font-bold text-sm z-10">{cooldown}</span>
          )}
        </div>
      ) : (
        <div className="w-full h-full bg-slate-800 opacity-90" />
      )}
    </div>
  );
};
