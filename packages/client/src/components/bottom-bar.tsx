import { eventBus } from "@/game/eventBus/eventBus";
import {
  SkillUIData,
  PlayerUIData,
  StatusEffectUIData,
} from "@/game/eventBus/types";
import { useEffect, useState } from "react";
import { Feat } from "@backend/game/modules/feats/feat";
import { SkillSlot } from "./skill-slot";
import { StatusEffect } from "@backend/game/modules/statusEffects/statusEffect";
import { StatusEffectSlot } from "./status-effect-slot";

interface BottomBarProps {
  playerData: PlayerUIData;
}

export const BottomBar: React.FC<BottomBarProps> = ({ playerData }) => {
  const [skills, setSkills] = useState<SkillUIData[]>([]);
  const [statusEffects, setStatusEffects] = useState<StatusEffectUIData[]>([]);

  useEffect(() => {
    const updateFeatsHandler = (feats: Feat[]) => {
      setSkills(
        feats.map((feat, index) => ({
          name: feat.name,
          isReady: feat.isReady,
          index,
          readyAt: feat.cooldownEndTime,
          cooldown: feat.cooldown,
        }))
      );
    };

    const updateStatusEffectsHandler = (effects: StatusEffect[]) => {
      setStatusEffects(
        effects.map((e) => ({
          name: e.name,
          icon: e.name,
          endTime: e.startTime + e.duration,
        }))
      );
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

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-[5px]">
      {/* Left side skills*/}
      <div className="flex gap-[3px] mb-[30px]">
        {slots.slice(0, 5).map((skill, index) => (
          <SkillSlot key={`left-${index}`} skill={skill} index={index} />
        ))}
      </div>

      {/* HP circle */}
      <div className="relative w-[140px] h-[140px] rounded-full border-[2px] border-[#9a8800] overflow-hidden flex items-center justify-center">
        <span className="text-white font-bold z-50 font-orbitron text-xl">
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
        <div className="flex gap-[8px] mb-1 ml-[20px]">
          {statusEffects.map((effect, idx) => (
            <StatusEffectSlot key={`se-${idx}`} effect={effect} />
          ))}
        </div>

        {/* Right side skills*/}
        <div className="flex gap-[3px] mb-[30px]">
          {slots.slice(5, 10).map((skill, index) => (
            <SkillSlot key={`right-${index}`} skill={skill} index={index + 5} />
          ))}
        </div>
      </div>
    </div>
  );
};
