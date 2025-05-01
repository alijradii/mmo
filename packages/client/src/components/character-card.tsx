import { Card } from "./ui/card";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { displayDataAtom } from "@/state/userAtom";

interface DirectionOrder {
  [index: string]: number;
}

interface Category {
  name: string;
  path: string;
  icon: string;
  primary: string[];
  all: string[];
  order: DirectionOrder;
}

type DirectionalDepth = {
  [index: string]: number;
};

type ComponentsDepthIndex = {
  [index: string]: DirectionalDepth;
};

const componetsDepthIndex: ComponentsDepthIndex = {
  frontextra: { up: 4, down: 8, left: 8, right: 8 },
  backextra: { up: 5, down: 1, left: 1, right: 1 },
  hair: { up: 7, down: 6, left: 6, right: 6 },
  backhair: { up: 8, down: 2, left: 4, right: 4 },
  hat: { up: 9, down: 7, left: 7, right: 7 },
  weapon: { up: 1, down: 9, left: 9, right: 9 },
  head: { up: 6, down: 5, left: 5, right: 5 },
  top: { up: 3, down: 4, left: 3, right: 3 },
  bottom: { up: 2, down: 3, left: 2, right: 2 },
};

interface CharacterCardProps {
  direction?: string;
  frameWidth?: number;
  frameHeight?: number;
  scale?: number;
  appearance?: Record<string, string>;
}

interface Category {
  name: string;
  path: string;
  icon: string;
  primary: string[];
  all: string[];
  order: DirectionOrder;
}

const categories: Category[] = [
  {
    name: "Front Extra",
    path: "frontextra",
    icon: "frontextra1",
    primary: [],
    all: [],
    order: { South: 10, North: 0, West: 10 },
  },
  {
    name: "Hat",
    path: "hat",
    icon: "hat1",
    primary: [],
    all: [],
    order: { South: 9, North: 11, West: 9 },
  },
  {
    name: "Hair",
    path: "hair",
    primary: [],
    all: [],
    icon: "hair1",

    order: { South: 8, North: 3, West: 4 },
  },
  {
    name: "Head",
    path: "head",
    primary: [],
    all: [],
    icon: "head1",

    order: { South: 6, North: 1, West: 2 },
  },
  {
    name: "Top",
    path: "top",
    primary: [],
    all: [],
    icon: "top1",
    order: { South: 4, North: 4, West: 0 },
  },
  {
    name: "Bottom",
    path: "bottom",
    primary: [],
    all: [],
    icon: "bottom1",

    order: { South: 5, North: 4, West: 0 },
  },
  {
    name: "Back Hair",
    path: "backhair",
    primary: [],
    all: [],
    icon: "backhair1",
    order: { South: 0, North: 10, West: 3 },
  },
  {
    name: "Weapon",
    path: "weapon",
    primary: [],
    all: [],
    icon: "axe1",
    order: { South: 100, North: 0, West: 100 },
  },
  {
    name: "Back Extra",
    path: "backextra",
    primary: [],
    all: [],
    icon: "backextra",
    order: { South: 0, North: 10, West: 3 },
  },
];

export const CharacterCard: React.FC<CharacterCardProps> = ({
  direction = "down",
  frameWidth = 48,
  frameHeight = 48,
  scale = 2,
}) => {
  const index: number = ["down", "left", "right", "up"].indexOf(direction);

  const [selectedColorSwap, setSwap] = useState<Record<string, string>>({});

  const [userData] = useAtom(displayDataAtom);

  useEffect(() => {
    setSwap(userData?.gear || {})
  }, [userData]);

  return (
    <Card
      key={direction}
      aria-label={direction}
      className="flex items-center justify-center w-full py-2 bg-zinc-800"
    >
      <div
        className="relative"
        role="img"
        aria-label="Character sprite"
        style={{
          width: `${frameWidth * scale * 2}px`,
          height: `${frameHeight * scale * 2}px`,
        }}
      >
        {categories.map((category) => {
          const swap = selectedColorSwap[category.path];
          if (swap === "") return <div key={category.path + direction} />;

          return (
            <div
              className="absolute"
              key={category.path + direction}
              style={{
                zIndex: componetsDepthIndex[category.path][direction],
                width: `${frameWidth * scale * 2}px`,
                height: `${frameHeight * scale * 2}px`,
                backgroundImage: `url("/assets/spritesheets/player/${category.path}/${swap}.png")`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${1104 * scale * 2}px ${192 * scale * 2}px`,
                backgroundPosition: `-${48 * scale * 2}px -${
                  48 * index * scale * 2
                }px`,
                imageRendering: "pixelated",
              }}
            />
          );
        })}
      </div>
    </Card>
  );
};
