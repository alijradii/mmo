import { eventBus } from "@/game/eventBus/eventBus";
import { SkillUIData } from "@/game/eventBus/types";

interface props {
  skills: (SkillUIData | null)[];
}

export const SkillBar: React.FC<props> = ({ skills }: props) => {
  return (
    <div className="w-full bg-slate-600 flex p-[2px] mb-[10px] justify-center gap-2 z-[100] pointer-events-auto">
      {skills.map((skill, index: number) => {
        return (
          <div
            key={skill?.name || index}
            className="w-[30px] h-[30px] border-slate-950 border-solid border-[1px]"
            onClick={() => {
              console.log(skill);
              if (skill) eventBus.emit("use-skill", skill);
            }}
          >
            {skill && <div className="w-full h-full bg-red-500"></div>}
          </div>
        );
      })}
    </div>
  );
};
