import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchItems } from "@/utils/fetchItems";
import { useEffect } from "react";

export const ItemsDashboard: React.FC = () => {
  useEffect(() => {
    fetchItems();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Items</CardTitle>
        <CardDescription>A list of all the items in game.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col w-full"></div>
      </CardContent>
    </Card>
  );
};
