import { eventBus } from "@/game/eventBus/eventBus";
import { SkillUIData } from "@/game/eventBus/types";
import { useEffect, useState } from "react";

import { Feat } from "@backend/schemas/modules/feats/feat";

export const SkillBar: React.FC = () => {
  const [skills, setSkills] = useState<SkillUIData[]>([]);

  useEffect(() => {
    const updateFeatsHandler = (feats: Feat[]) => {
      setSkills(
        feats.map((feat, index) => ({
          name: feat.name,
          isReady: feat.isReady,
          index,
        }))
      );
    };

    eventBus.on("update-feats", updateFeatsHandler);

    return () => {
      eventBus.off("update-feats", updateFeatsHandler);
    };
  }, []);

  return (
    <div className="w-full bg-slate-600 flex p-[2px] mb-[10px] justify-center gap-2 z-[100] pointer-events-auto">
      {skills.map((skill, index: number) => {
        return (
          <div
            key={index}
            className="w-[30px] h-[30px] border-slate-950 border-solid border-[1px]"
            onClick={() => {
              if (skill) eventBus.emit("use-skill", skill);
            }}
          >
            {skill && (
              <div
                className={`w-full h-full ${
                  skill.isReady ? "bg-red-500" : "bg-gray-500"
                }`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
};
