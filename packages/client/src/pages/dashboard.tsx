import { useState } from "react";
import { DashboardHome } from "@/components/dashboard/home";
import { DashboardUsers } from "@/components/dashboard/users";

import { Button } from "@/components/ui/button";
import { ItemsDashboard } from "@/components/dashboard/items/items-dashboard";
import { WeaponsDashboard } from "@/components/dashboard/weapons/weapon-dashboard";
import { ArmorDashboard } from "@/components/dashboard/armor/armor-dashboard";

const sections = {
  home: <DashboardHome />,
  users: <DashboardUsers />,
  items: <ItemsDashboard/>,
  weapons: <WeaponsDashboard/>,
  armor: <ArmorDashboard/>
};

export default function DashboardPage() {
  const [selected, setSelected] = useState<"home" | "users" | "items" | "weapons">("home");

  return (
    <div className="flex min-h-screen">
      <Sidebar
        items={[
          { id: "home", label: "Dashboard" },
          { id: "users", label: "Users" },
          { id: "items", label: "Items" },
          { id: "weapons", label: "Weapons" },
          { id: "armor", label: "Armor" },
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
