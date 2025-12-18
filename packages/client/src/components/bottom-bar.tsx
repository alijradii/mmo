import { eventBus } from "@/game/eventBus/eventBus";
import {
  SkillUIData,
  PlayerUIData,
  StatusEffectUIData,
} from "@/game/eventBus/types";
import { useEffect, useState } from "react";
import { SkillSlot } from "./skill-slot";
import { StatusEffectSlot } from "./status-effect-slot";
import { useIsMobile } from "../hooks/use-mobile";

interface BottomBarProps {
  playerData: PlayerUIData;
}

export const BottomBar: React.FC<BottomBarProps> = ({ playerData }) => {
  const isMobile = useIsMobile();
  const [skills, setSkills] = useState<SkillUIData[]>([]);
  const [statusEffects, setStatusEffects] = useState<StatusEffectUIData[]>([]);

  useEffect(() => {
    const updateFeatsHandler = (feats: SkillUIData[]) => {
      setSkills(feats);
    };

    const updateStatusEffectsHandler = (effects: StatusEffectUIData[]) => {
      setStatusEffects(effects);
    };

    eventBus.on("update-feats", updateFeatsHandler);
    eventBus.on("update-status-effects", updateStatusEffectsHandler);

    return () => {
      eventBus.off("update-feats", updateFeatsHandler);
      eventBus.off("update-status-effects", updateStatusEffectsHandler);
    };
  }, []);

  const slots = [...skills];
  while (slots.length < 10) {
    slots.push(null as unknown as SkillUIData);
  }

  const hpCircleSize = isMobile ? "w-20 h-20" : "w-[140px] h-[140px]";
  const hpTextSize = isMobile ? "text-sm" : "text-xl";
  const skillGap = isMobile ? "gap-[2px]" : "gap-[3px]";
  const bottomMargin = isMobile ? "mb-[20px]" : "mb-[30px]";

  return (
    <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end ${skillGap}`}>
      {/* Left side skills*/}
      <div className={`flex ${skillGap} ${bottomMargin}`}>
        {slots.slice(0, 5).map((skill, index) => (
          <SkillSlot key={`left-${index}`} skill={skill} index={index} />
        ))}
      </div>

      {/* HP circle */}
      <div className={`relative ${hpCircleSize} rounded-full border-[2px] border-[#9a8800] overflow-hidden flex items-center justify-center`}>
        <span className={`text-white font-bold z-50 font-orbitron ${hpTextSize}`}>
          {playerData.hp}
        </span>
        <div
          className="absolute bottom-0 w-full bg-gradient-to-t from-red-900 to-red-950 z-20"
          style={{ height: `${(playerData.hp / playerData.maxHp) * 100}%` }}
        />

        <div className="absolute bg-slate-900 w-full h-full z-0 opacity-50"></div>
      </div>

      {/* Right side */}
      <div className="flex flex-col gap-2">
        {/* Status effects row */}
        <div className={`flex ${isMobile ? "gap-1" : "gap-[8px]"} mb-1 ${isMobile ? "ml-[10px]" : "ml-[20px]"}`}>
          {statusEffects.map((effect, idx) => (
            <StatusEffectSlot key={`se-${idx}`} effect={effect} />
          ))}
        </div>

        {/* Right side skills*/}
        <div className={`flex ${skillGap} ${bottomMargin}`}>
          {slots.slice(5, 10).map((skill, index) => (
            <SkillSlot key={`right-${index}`} skill={skill} index={index + 5} />
          ))}
        </div>
      </div>
    </div>
  );
};
