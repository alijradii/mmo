import InventorySystem from "@/components/inventory-old/inventory-system";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const EquipmentTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment</CardTitle>
        <CardDescription>
          View your character's gear and current inventory.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InventorySystem />
      </CardContent>
    </Card>
  );
};
