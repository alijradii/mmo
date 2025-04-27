import { Card } from "@/components/ui/card";
import { Item } from "@backend/database/models/item.model";

interface ItemDisplayProps {
  item: Item;
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