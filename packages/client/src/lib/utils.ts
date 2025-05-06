import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case "common":
      return "border-gray-500";
    case "uncommon":
      return "border-green-500";
    case "rare":
      return "border-blue-500";
    case "epic":
      return "border-purple-500";
    case "legendary":
      return "border-orange-500";
    default:
      return "border-gray-500";
  }
}
