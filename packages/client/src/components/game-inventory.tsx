import { useState } from "react";
import { InventorySystem } from "./inventory/inventory-system";
import { eventBus } from "@/game/eventBus/eventBus";

export const GameInventory: React.FC = () => {
  const [hidden, setHidden] = useState(true);

  eventBus.on("toggle-inventory", () => {
    setHidden(!hidden);
  });

  return (
    <div className={`pointer-events-auto ${hidden ? "hidden" : ""} fixed inset-0 flex justify-center items-center z-[99] bg-black/50`}>
      <InventorySystem />
    </div>
  );
};
