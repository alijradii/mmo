import type React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { IPlayer } from "@backend/database/models/player.model";
import { useEffect, useState } from "react";

import { CharacterCard } from "@/components/character-card";
import { displayDataAtom } from "@/state/userAtom";
import { useAtom } from "jotai";

interface DirectionOrder {
    [index: string]: number;
}

interface Category {
    name: string;
    path: "hat" | "frontextra" | "hair" | "backhair" | "head" | "top" | "bottom" | "weapon" | "backextra";
    icon: string;
    primary: string[];
    all: string[];
    order: DirectionOrder;
}

const initialCategories: Category[] = [
    {
        name: "Weapon",
        path: "weapon",
        icon: "sword1",
        primary: [],
        all: [],
        order: { South: 9, North: 1, West: 9, East: 9 },
    },
    {
        name: "Front Extra",
        path: "frontextra",
        icon: "frontextra1",
        primary: [],
        all: [],
        order: { South: 8, North: 4, West: 8, East: 8 },
    },
    {
        name: "Hat",
        path: "hat",
        icon: "hat1",
        primary: [],
        all: [],
        order: { South: 7, North: 9, West: 7, East: 7 },
    },
    {
        name: "Hair",
        path: "hair",
        primary: [],
        all: [],
        icon: "hair1",
        order: { South: 6, North: 7, West: 6, East: 6 },
    },
    {
        name: "Back Extra",
        path: "backextra",
        icon: "backextra1",
        primary: [],
        all: [],
        order: { South: 1, North: 5, West: 1, East: 1 },
    },
    {
        name: "Head",
        path: "head",
        primary: [],
        all: [],
        icon: "head1",
        order: { South: 5, North: 6, West: 5, East: 5 },
    },
    {
        name: "Top",
        path: "top",
        primary: [],
        all: [],
        icon: "top1",
        order: { South: 4, North: 3, West: 3, East: 3 },
    },
    {
        name: "Bottom",
        path: "bottom",
        primary: [],
        all: [],
        icon: "bottom1",
        order: { South: 3, North: 2, West: 2, East: 2 },
    },
    {
        name: "Back Hair",
        path: "backhair",
        primary: [],
        all: [],
        icon: "backhair1",
        order: { South: 2, North: 8, West: 4, East: 4 },
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
    backextra?: string;
}
const frameWidth = 48;
const frameHeight = 48;

const scale = 2;

export const GeneratorPage: React.FC = () => {
    const [userData, setUserData] = useAtom(displayDataAtom);

    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0]);
    const [selectedPrimary, setSelectedPrimary] = useState<IGear>({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = () => {
        const gear = userData?.appearance;
        setSelectedPrimary({
            head: gear?.head || "",
            top: gear?.top || "",
            bottom: gear?.bottom || "",
            weapon: gear?.weapon || "",
            hat: gear?.hat || "",
            hair: gear?.hair || "",
            frontextra: gear?.frontextra || "",
            backhair: gear?.backhair || "",
            backextra: gear?.backextra || "",
        });
    };

    useEffect(() => {
        fetch("/assets/data/spritesheets/player.json")
            .then(response => response.json())
            .then(data => {
                const updatedCategories = categories.map(category => {
                    const all = data[category.path] || [];
                    const primary = all.filter((c: string) => !c.includes("_"));
                    return { ...category, all, primary };
                });

                setCategories(updatedCategories);
                setSelectedCategory(updatedCategories[0]);

                fetchUser();
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            });
    }, []);

    const getColorSwaps = (primaryItem: string): string[] => {
        const category = categories.find(c => c.path === selectedCategory.path);
        return category ? ["", ...category.all.filter(item => item.includes(primaryItem))] : [""];
    };

    const handlePrimarySelect = (categoryId: string, image: string) => {
        setSelectedPrimary(prev => ({ ...prev, [categoryId]: image }));
    };

    const handleColorSwapSelect = (categoryId: string, image: string) => {
        const user: IPlayer = { ...userData } as unknown as IPlayer;
        user.appearance = {
            ...user.appearance,
            [categoryId]: image,
        };
        setUserData(user);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Card className="container mx-auto p-4 my-[20px]">
            <Tabs
                value={selectedCategory.path}
                onValueChange={value => {
                    const newCategory = categories.find(c => c.path === value);
                    if (newCategory) setSelectedCategory(newCategory);
                }}
            >
                <div className="flex justify-center items-center mb-4">
                    <div className="flex gap-2 items-center justify-center">
                        <TabsList className="h-auto grid grid-cols-4 sm:grid-cols-9 gap-2 p-2">
                            {categories.map(category => (
                                <TabsTrigger key={category.path} value={category.path} asChild>
                                    <div
                                        className="relative cursor-pointer"
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
                    </div>
                </div>

                {categories.map(category => (
                    <TabsContent key={category.path} value={category.path}>
                        <div className="space-y-4">
                            <ScrollArea className=" w-full whitespace-nowrap rounded-md border">
                                <div className="flex gap-4 p-4">
                                    {category.primary.map(image => (
                                        <Button
                                            key={image}
                                            variant="outline"
                                            className={cn(
                                                "w-20 h-20",
                                                selectedPrimary[category.path] === image ? "bg-zinc-800" : ""
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
                                                        backgroundSize: `${1104 * scale}px ${192 * scale}px`,
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
                                    {getColorSwaps(selectedPrimary[category.path] || "").map(swap => (
                                        <Button
                                            key={swap}
                                            variant="outline"
                                            onClick={() => handleColorSwapSelect(category.path, swap)}
                                            className={cn(
                                                "w-20 h-20",
                                                userData?.appearance?.[category.path] === swap ? "bg-zinc-800" : ""
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
                                                        backgroundSize: `${1104 * scale}px ${192 * scale}px`,
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
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-10 justify-center sm:justify-between items-center mt-5">
                {["down", "left", "right", "up"].map(direction => (
                    <CharacterCard key={direction} direction={direction} />
                ))}
            </div>
        </Card>
    );
};
