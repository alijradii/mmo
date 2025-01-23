import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
    order: { South: 10, North: 0,  West: 10 },
  },
  {
    name: "Hat",
    path: "hat",
    icon: "hat1",
    primary: [],
    all: [],
    order: { South: 9, North: 11,  West: 9 },
  },
  {
    name: "Hair",
    path: "hair",
    primary: [],
    all: [],
    icon: "hair1",

    order: { South: 8, North: 3,  West: 4 },
  },
  {
    name: "Head",
    path: "head",
    primary: [],
    all: [],
    icon: "head1",

    order: { South: 6, North: 1,  West: 2 },
  },
  {
    name: "Top",
    path: "top",
    primary: [],
    all: [],
    icon: "top1",
    order: { South: 4, North: 4,  West: 0 },
  },
  {
    name: "Bottom",
    path: "bottom",
    primary: [],
    all: [],
    icon: "bottom1",

    order: { South: 5, North: 4,  West: 0 },
  },
  {
    name: "Back Hair",
    path: "backhair",
    primary: [],
    all: [],
    icon: "backhair1",
    order: { South: 0, North: 10,  West: 3 },
  },
  {
    name: "Weapon",
    path: "weapon",
    primary: [],
    all: [],
    icon: "axe1",
    order: { South: 100, North: 0,  West: 100 },
  },
];

const frameWidth = 48;
const frameHeight = 48;

const scale = 2;

export const GeneratorPage: React.FC = () => {
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

  console.log(selectedColorSwap);

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
            initialPrimary[category.name] = category.primary[0];
            const colorSwaps = category.all.filter((item: string) =>
              item.includes(category.primary[0])
            );
            if (colorSwaps.length > 0) {
              initialColorSwap[category.name] = colorSwaps[0];
            }
          }
        });

        setSelectedPrimary(initialPrimary);
        setSelectedColorSwap(initialColorSwap);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  const getColorSwaps = (primaryItem: string): string[] => {
    const category = categories.find((c) => c.name === selectedCategory.name);
    return category
      ? category.all.filter((item) => item.includes(primaryItem))
      : [];
  };

  const handlePrimarySelect = (categoryId: string, image: string) => {
    setSelectedPrimary((prev) => ({ ...prev, [categoryId]: image }));
    // Reset color swap when primary image changes
    setSelectedColorSwap((prev) => ({ ...prev, [categoryId]: "" }));
  };

  const handleColorSwapSelect = (categoryId: string, image: string) => {
    setSelectedColorSwap((prev) => ({ ...prev, [categoryId]: image }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 my-[20px]">
      <Tabs
        value={selectedCategory.name}
        onValueChange={(value) => {
          const newCategory = categories.find((c) => c.name === value);
          if (newCategory) setSelectedCategory(newCategory);
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList className="h-[100px]">
            {categories.map((category) => (
              <TabsTrigger key={category.name} value={category.name} asChild>
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
          <Button>Confirm</Button>
        </div>

        {categories.map((category) => (
          <TabsContent key={category.name} value={category.name}>
            <div className="space-y-4">
              <ScrollArea className=" w-full whitespace-nowrap rounded-md border">
                <div className="flex gap-4 p-4">
                  {category.primary.map((image) => (
                    <Button
                      key={image}
                      variant="outline"
                      className={cn(
                        "w-20 h-20",
                        selectedPrimary[category.name] === image
                          ? "bg-zinc-800"
                          : ""
                      )}
                      onClick={() => handlePrimarySelect(category.name, image)}
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
                  {getColorSwaps(selectedPrimary[category.name] || "").map(
                    (swap) => (
                      <Button
                        key={swap}
                        variant="outline"
                        onClick={() =>
                          handleColorSwapSelect(category.name, swap)
                        }
                        className={cn(
                          "w-20 h-20",
                          selectedColorSwap[category.name] === swap
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
        {["South", "West", "North"].map((direction, index) => (
          <Card
            key={direction}
            aria-label={direction}
            className="flex items-center justify-center w-full py-2"
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
                const swap = selectedColorSwap[category.name];
                if (swap === "") return <div />;

                return (
                  <div
                    className="absolute"
                    style={{
                      zIndex: category.order[direction],
                      width: `${frameWidth * scale * 2}px`,
                      height: `${frameHeight * scale * 2}px`,
                      backgroundImage: `url("/assets/spritesheets/player/${category.path}/${swap}.png")`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: `${1104 * scale * 2}px ${
                        192 * scale * 2
                      }px`,
                      backgroundPosition: `-${48 * scale * 2}px -${
                        48 * (direction === "North" ? 3 : index) * scale * 2
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
