import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

export const ModifyItem = () => {
  // You would fetch data from API here
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <h2 className="text-xl font-bold">Item Management</h2>

        <div className="grid gap-4">
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input id="name" placeholder="Sword of Truth" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="A legendary blade..." />
          </div>
          <div>
            <Label htmlFor="rarity">Rarity</Label>
            <Input id="rarity" placeholder="common | rare | legendary..." />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Input id="type" placeholder="weapon | armor | consumable..." />
          </div>
          <div>
            <Label htmlFor="maxStack">Max Items Per Stack</Label>
            <Input id="maxStack" type="number" defaultValue={1} />
          </div>
          <Button>Add / Update Item</Button>
        </div>
      </CardContent>
    </Card>
  );
};
