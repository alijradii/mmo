import { Card } from "@/components/ui/card";
import { IWeapon } from "@backend/database/models/weapon.model";

interface ItemDisplayProps {
  item: IWeapon;
  onClick: () => void;
}

export const ItemDisplay: React.FC<ItemDisplayProps> = ({ item, onClick }) => {
  return (
    <Card
      className="p-4 cursor-pointer hover:bg-muted transition"
      onClick={onClick}
    >
      <div className="font-semibold">{item.name}</div>
      <div className="text-sm text-gray-500">{item.description}</div>
    </Card>
  );
};