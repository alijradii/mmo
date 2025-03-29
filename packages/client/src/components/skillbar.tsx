import { SkillUIData } from "@/game/eventBus/types";

interface props {
  skills: (SkillUIData | null)[];
}

export const SkillBar: React.FC<props> = ({ skills }: props) => {
  return (
    <div className="w-full bg-slate-600 flex p-[2px] mb-[10px] justify-center gap-2">
      {skills.map((skill) => {
        return <div className="w-[30px] h-[30px] border-slate-950 border-solid border-[1px]"></div>;
      })}
    </div>
  );
};
