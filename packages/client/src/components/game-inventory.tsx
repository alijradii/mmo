import { useState } from "react";
import { InventorySystem } from "./inventory/inventory-system";
import { eventBus } from "@/game/eventBus/eventBus";

export const GameInventory: React.FC = () => {
  const [hidden, setHidden] = useState(true);

  eventBus.on("toggle-inventory", () => {
    setHidden(!hidden);
  });

  return (
    <div className={`pointer-events-auto ${hidden ? "hidden" : ""} flex w-screen h-screen justify-center items-center z-99`}>
      <InventorySystem />
    </div>
  );
};
