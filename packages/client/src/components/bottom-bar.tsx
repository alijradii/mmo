import { eventBus } from "@/game/eventBus/eventBus";
import { SkillUIData, PlayerUIData } from "@/game/eventBus/types";
import { useEffect, useState } from "react";
import { Feat } from "@backend/game/modules/feats/feat";
import { SkillSlot } from "./skill-slot";

interface BottomBarProps {
  playerData: PlayerUIData;
}

export const BottomBar: React.FC<BottomBarProps> = ({ playerData }) => {
  const [skills, setSkills] = useState<SkillUIData[]>([]);

  useEffect(() => {
    const updateFeatsHandler = (feats: Feat[]) => {
      setSkills(
        feats.map((feat, index) => ({
          name: feat.name,
          isReady: feat.isReady,
          index,
          readyAt: feat.cooldownEndTime,
          cooldown: feat.cooldown
        }))
      );
    };

    eventBus.on("update-feats", updateFeatsHandler);
    return () => {
      eventBus.off("update-feats", updateFeatsHandler);
    };
  }, []);

  const slots = [...skills];
  while (slots.length < 10) {
    slots.push(null as unknown as SkillUIData);
  }

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
      {/* Left skills (first 5) */}
      <div className="flex gap-[3px] mt-[35px]">
        {slots.slice(0, 5).map((skill, index) => (
          <SkillSlot key={`left-${index}`} skill={skill} index={index} />
        ))}
      </div>

      {/* HP circle */}
      <div className="relative w-[140px] h-[140px] rounded-full border-[2px] border-[#7c6e00] overflow-hidden flex items-center justify-center">
        <span className="text-white font-bold z-50 font-orbitron text-xl">
          {playerData.hp}
        </span>
        <div
          className="absolute bottom-0 w-full bg-gradient-to-t from-red-900 to-red-950"
          style={{ height: `${(playerData.hp / playerData.maxHp) * 100}%` }}
        />
      </div>

      {/* Right skills (last 5) */}
      <div className="flex gap-[3px] mt-[35px]">
        {slots.slice(5, 10).map((skill, index) => (
          <SkillSlot key={`right-${index}`} skill={skill} index={index + 5} />
        ))}
      </div>
    </div>
  );
};
