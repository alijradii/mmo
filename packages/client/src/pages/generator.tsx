import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { IPlayer } from "@backend/database/models/player.model";
import { fetchSelfData } from "@/utils/fetchUserData";

import axios from "axios";
import { useToast } from "@/hooks/use-toast";

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
  {
    name: "Weapon",
    path: "weapon",
    primary: [],
    all: [],
    icon: "axe1",
    order: { South: 100, North: 0, West: 100 },
  },
];

type DirectionalDepth = {
  [index: string]: number;
};

type ComponentsDepthIndex = {
  [index: string]: DirectionalDepth;
};

const componetsDepthIndex: ComponentsDepthIndex = {
  frontextra: { up: 4, down: 8, left: 9, right: 8 },
  backextra: { up: 5, down: 1, left: 1, right: 1 },
  hair: { up: 7, down: 6, left: 7, right: 6 },
  backhair: { up: 8, down: 2, left: 5, right: 4 },
  hat: { up: 9, down: 7, left: 8, right: 7 },
  weapon: { up: 1, down: 9, left: 2, right: 9 },
  head: { up: 6, down: 5, left: 6, right: 5 },
  top: { up: 3, down: 4, left: 4, right: 3 },
  bottom: { up: 2, down: 3, left: 3, right: 2 },
};

const frameWidth = 48;
const frameHeight = 48;

const scale = 2;

export const GeneratorPage: React.FC = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    categories[0]
  );
  const [selectedPrimary, setSelectedPrimary] = useState<
    Record<string, string>
  >({});
  const [selectedColorSwap, setSelectedColorSwap] = useState<
    Record<string, string>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<IPlayer | null>(null);

  const fetchUser = () => {
    fetchSelfData()
      .then((u: IPlayer) => {
        if (!u) throw new Error("user not found");
        setUser(u);

        const swap: Record<string, string> = {
          head: u.gear.head,
          top: u.gear.top,
          bottom: u.gear.bottom,
          weapon: u.gear.weapon,
          hat: u.gear.hat,
          hair: u.gear.hair,
          frontextra: u.gear.frontextra,
          backhair: u.gear.backhair,
        };

        setSelectedPrimary(swap);
        setSelectedColorSwap(swap);
      })
      .catch((e) => {
        console.log("An error occured", e.message);
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

        // Initialize selectedPrimary and selectedColorSwap with default values
        const initialPrimary: Record<string, string> = {};
        const initialColorSwap: Record<string, string> = {};
        updatedCategories.forEach((category) => {
          if (category.primary.length > 0) {
            initialPrimary[category.path] = category.primary[0];
            const colorSwaps = category.all.filter((item: string) =>
              item.includes(category.primary[0])
            );
            if (colorSwaps.length > 0) {
              initialColorSwap[category.path] = colorSwaps[0];
            }
          }
        });

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
      ? category.all.filter((item) => item.includes(primaryItem))
      : [];
  };

  const handlePrimarySelect = (categoryId: string, image: string) => {
    setSelectedPrimary((prev) => ({ ...prev, [categoryId]: image }));
    setSelectedColorSwap((prev) => ({ ...prev, [categoryId]: "" }));
  };

  const handleColorSwapSelect = (categoryId: string, image: string) => {
    setSelectedColorSwap((prev) => ({ ...prev, [categoryId]: image }));
  };

  const onSubmit = () => {
    const userData = {
      head: selectedColorSwap["head"],
      top: selectedColorSwap["top"],
      bottom: selectedColorSwap["bottom"],
      weapon: selectedColorSwap["weapon"],
      frontextra: selectedColorSwap["frontextra"],
      hair: selectedColorSwap["hair"],
      hat: selectedColorSwap["hat"],
      backhair: selectedColorSwap["backhair"],
    };
    console.log(userData);

    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:4070";
    axios
      .post(`${backendUrl}/user/gear`, userData, {
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
    <div className="container mx-auto p-4 my-[20px]">
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

            <Button className="h-full" onClick={onSubmit}>
              Confirm
            </Button>
          </div>

          <div className="w-full mx-[40px]">
            <h1>Username: {user?.username || "null"}</h1>
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
                          selectedColorSwap[category.path] === swap
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
        {["down", "left", "right", "up"].map((direction, index) => (
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
                if (swap === "") return <div />;

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
                      backgroundSize: `${1104 * scale * 2}px ${
                        192 * scale * 2
                      }px`,
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
        ))}
      </div>
    </div>
  );
};
