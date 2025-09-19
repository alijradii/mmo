import { StatusEffectUIData } from "@/game/eventBus/types";
import { useEffect, useState } from "react";

interface StatusEffectSlotProps {
  effect: StatusEffectUIData;
}

export const StatusEffectSlot: React.FC<StatusEffectSlotProps> = ({
  effect,
}) => {
  const [remaining, setRemaining] = useState<number>(0);
  useEffect(() => {
    const updateRemaining = () => {
      const now = Date.now();
      const end = new Date(effect.endTime).getTime();
      const diff = Math.max(0, Math.ceil((end - now) / 1000));
      setRemaining(diff);
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [effect]);

  return (
    <div key={effect.name} className="flex flex-col items-center w-[24px]">
      <img
        src={`assets/gui/icons/status-effects/${effect.name}.png`}
        alt={effect.name.slice(0, 2)}
        className="w-[30px] h-[30px] object-cover"
      />

      <span className="text-white text-[12px] leading-none">{remaining}</span>
    </div>
  );
};
