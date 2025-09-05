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

  // hotkey number (1–9, then 0)
  const hotkey = (index + 1) % 10;

  return (
    <div
      key={index}
      className="relative w-[50px] h-[50px] border border-slate-950 pointer-events-auto overflow-hidden"
      onClick={() => {
        if (skill) eventBus.emit("use-skill", skill);
      }}
    >
      {/* Hotkey indicator (top-left corner) */}
      <span className="absolute top-0 left-0 text-xs text-white bg-black/70 px-[2px] z-20">
        {hotkey}
      </span>

      {skill ? (
        <>
          {/* Skill icon */}
          <img
            src={`${skill.name}.png`}
            alt={skill.name.slice(0,3)}
            className="w-full h-full object-cover"
          />

          {/* Black cooldown overlay */}
          {!skill.isReady && cooldown > 0 && (
            <>
              <div
                className="absolute bottom-0 left-0 w-full bg-black/70 z-10"
                style={{
                  height: `${
                    skill.cooldown
                      ? Math.floor((cooldown * 100) / skill.cooldown)
                      : 100
                  }%`,
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm z-20">
                {cooldown}
              </span>
            </>
          )}
        </>
      ) : (
        // Empty slot
        <div className="w-full h-full bg-slate-800 opacity-70" />
      )}
    </div>
  );
};
