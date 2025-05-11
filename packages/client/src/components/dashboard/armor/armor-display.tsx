import { Card } from "@/components/ui/card";
import { IArmor } from "@backend/database/models/armor.model";

interface ItemDisplayProps {
  item: IArmor;
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