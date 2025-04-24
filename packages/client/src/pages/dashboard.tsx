import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
// import { Sidebar } from "@/components/ui/sidebar";

// Dummy pages
const DashboardHome = () => (
  <Card>
    <CardContent className="p-6">Welcome to the Admin Dashboard!</CardContent>
  </Card>
);

const UsersPage = () => (
  <Card>
    <CardContent className="p-6">User Management Placeholder</CardContent>
  </Card>
);

const ItemsDashboard = () => {
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

const sections = {
  home: <DashboardHome />,
  users: <UsersPage />,
  items: <ItemsDashboard />,
};

export default function DashboardPage() {
  const [selected, setSelected] = useState<"home" | "users" | "items">("home");

  return (
    <div className="flex min-h-screen">
      <Sidebar
        items={[
          { id: "home", label: "Dashboard" },
          { id: "users", label: "Users" },
          { id: "items", label: "Items" },
        ]}
        selected={selected}
        onSelect={(id) => {
          setSelected(id as keyof typeof sections);
        }}
      />

      <main className="flex-1 p-6 bg-muted/50 overflow-y-auto">
        {sections[selected]}
      </main>
    </div>
  );
}

interface SidebarItem {
  id: string;
  label: string;
}

interface SidebarProps {
  items: SidebarItem[];
  selected: string;
  onSelect: (id: string) => void;
}

export function Sidebar({ items, selected, onSelect }: SidebarProps) {
  return (
    <aside className="w-64 bg-background border-r p-4">
      <div className="space-y-2">
        {items.map((item) => (
          <Button
            key={item.id}
            variant={selected === item.id ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelect(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </aside>
  );
}
