import type React from "react";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { IPlayer } from "@backend/database/models/player.model";

import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useAtom } from "jotai";
import { userDataAtom } from "@/state/userAtom";
import { CharacterCard } from "@/components/character-card";

interface DirectionOrder {
  [index: string]: number;
}

interface Category {
  name: string;
  path:
    | "hat"
    | "frontextra"
    | "hair"
    | "backhair"
    | "head"
    | "top"
    | "bottom"
    | "weapon";
  icon: string;
  primary: string[];
  all: string[];
  order: DirectionOrder;
}

const initialCategories: Category[] = [
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
];

interface IGear {
  frontextra?: string;
  hat?: string;
  head?: string;
  hair?: string;
  top?: string;
  bottom?: string;
  backhair?: string;
  weapon?: string;
}
const frameWidth = 48;
const frameHeight = 48;

const scale = 2;

export const GeneratorPage: React.FC = () => {
  const [userData, setUserData] = useAtom(userDataAtom);

  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    categories[0]
  );
  const [selectedPrimary, setSelectedPrimary] = useState<IGear>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = () => {
    const gear = userData?.gear;
    setSelectedPrimary({
      head: gear?.head || "",
      top: gear?.top || "",
      bottom: gear?.bottom || "",
      weapon: gear?.weapon || "",
      hat: gear?.hat || "",
      hair: gear?.hair || "",
      frontextra: gear?.frontextra || "",
      backhair: gear?.backhair || "",
    });
  };

  useEffect(() => {
    fetch("/assets/data/spritesheets/player.json")
      .then((response) => response.json())
      .then((data) => {
        const updatedCategories = categories.map((category) => {
          const all = data[category.path] || [];
          const primary = all.filter((c: string) => !c.includes("_"));
          return { ...category, all, primary };
        });

        setCategories(updatedCategories);
        setSelectedCategory(updatedCategories[0]);

        fetchUser();
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  const getColorSwaps = (primaryItem: string): string[] => {
    const category = categories.find((c) => c.path === selectedCategory.path);
    return category
      ? ["", ...category.all.filter((item) => item.includes(primaryItem))]
      : [""];
  };

  const handlePrimarySelect = (categoryId: string, image: string) => {
    setSelectedPrimary((prev) => ({ ...prev, [categoryId]: image }));
  };

  const handleColorSwapSelect = (categoryId: string, image: string) => {
    const user: IPlayer = { ...userData } as unknown as IPlayer;
    if (!user.gear) user.gear = {};
    user.gear = {
      ...user.gear,
      [categoryId]: image,
    };
    setUserData(user);
  };

  const onSubmit = () => {
    const gear = userData?.gear || {};

    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:4070";
    axios
      .post(`${backendUrl}/user/gear`, gear, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "colyseus-auth-token"
          )}`,
        },
      })
      .then((response) => {
        console.log(response.data);

        toast({
          title: "Success",
          description: "Successfully updated your player information!",
        });
      });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="container mx-auto p-4 my-[20px]">
      <Tabs
        value={selectedCategory.path}
        onValueChange={(value) => {
          const newCategory = categories.find((c) => c.path === value);
          if (newCategory) setSelectedCategory(newCategory);
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 items-center justify-center h-[100px]">
            <TabsList className="h-[100px]">
              {categories.map((category) => (
                <TabsTrigger key={category.path} value={category.path} asChild>
                  <div
                    className="relative "
                    style={{
                      width: `${frameWidth * scale}px`,
                      height: `${frameHeight * scale}px`,
                    }}
                    role="img"
                    aria-label="Character sprite"
                  >
                    <div
                      className="absolute"
                      style={{
                        width: `${frameWidth * scale}px`,
                        height: `${frameHeight * scale}px`,
                        backgroundImage: `url("/assets/spritesheets/player/${category.path}/${category.icon}.png")`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: `${1104 * scale}px ${192 * scale}px`,
                        backgroundPosition: `-${48 * scale}px 0px`,
                        imageRendering: "pixelated",
                      }}
                    />
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="h-full flex flex-col justify-between p-[4px]">
              <Button className="h-full flex-1" onClick={onSubmit}>
                Confirm
              </Button>
            </div>
          </div>
        </div>

        {categories.map((category) => (
          <TabsContent key={category.path} value={category.path}>
            <div className="space-y-4">
              <ScrollArea className=" w-full whitespace-nowrap rounded-md border">
                <div className="flex gap-4 p-4">
                  {category.primary.map((image) => (
                    <Button
                      key={image}
                      variant="outline"
                      className={cn(
                        "w-20 h-20",
                        selectedPrimary[category.path] === image
                          ? "bg-zinc-800"
                          : ""
                      )}
                      onClick={() => handlePrimarySelect(category.path, image)}
                      asChild
                    >
                      <div
                        className="relative "
                        style={{
                          width: `${frameWidth * scale}px`,
                          height: `${frameHeight * scale}px`,
                        }}
                        role="img"
                        aria-label="Character sprite"
                      >
                        <div
                          className="absolute"
                          style={{
                            width: `${frameWidth * scale}px`,
                            height: `${frameHeight * scale}px`,
                            backgroundImage: `url("/assets/spritesheets/player/${selectedCategory.path}/${image}.png")`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: `${1104 * scale}px ${
                              192 * scale
                            }px`,
                            backgroundPosition: `-${48 * scale}px 0px`,
                            imageRendering: "pixelated",
                          }}
                        />
                      </div>
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                <div className="flex gap-4 p-4">
                  {getColorSwaps(selectedPrimary[category.path] || "").map(
                    (swap) => (
                      <Button
                        key={swap}
                        variant="outline"
                        onClick={() =>
                          handleColorSwapSelect(category.path, swap)
                        }
                        className={cn(
                          "w-20 h-20",
                          userData?.gear?.[category.path] === swap
                            ? "bg-zinc-800"
                            : ""
                        )}
                        asChild
                      >
                        <div
                          className="relative "
                          style={{
                            width: `${frameWidth * scale}px`,
                            height: `${frameHeight * scale}px`,
                          }}
                          role="img"
                          aria-label="Character sprite"
                        >
                          <div
                            className="absolute"
                            style={{
                              width: `${frameWidth * scale}px`,
                              height: `${frameHeight * scale}px`,
                              backgroundImage: `url("/assets/spritesheets/player/${selectedCategory.path}/${swap}.png")`,
                              backgroundRepeat: "no-repeat",
                              backgroundSize: `${1104 * scale}px ${
                                192 * scale
                              }px`,
                              backgroundPosition: `-${48 * scale}px 0px`,
                              imageRendering: "pixelated",
                            }}
                          />
                        </div>
                      </Button>
                    )
                  )}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="w-full flex gap-10 justify-between mt-5">
        {["down", "left", "right", "up"].map((direction) => (
          <CharacterCard direction={direction} />
        ))}
      </div>
    </Card>
  );
};
