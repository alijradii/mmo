"use client";

import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CharacterCard } from "@/components/character-card";
import { useAtom } from "jotai";
import { displayDataAtom } from "@/state/userAtom";
import { Input } from "@/components/ui/input";

export const BasicsTab: React.FC = () => {
  const [userData, setUserData] = useAtom(displayDataAtom);

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Character Basics</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            General information about your character.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                <div className="flex-[2] flex flex-col gap-2">
                  <Label htmlFor="name" className="mx-2 text-xs sm:text-sm">
                    Character Name
                  </Label>
                  <Input
                    id="name"
                    className="py-2 px-2 text-sm"
                    value={userData?.username}
                    onChange={(e) => {
                      if (userData)
                        setUserData({ ...userData, username: e.target.value });
                    }}
                  />
                </div>

                <div className="flex-[1] flex flex-col gap-2">
                  <Label htmlFor="level" className="mx-2 text-xs sm:text-sm">
                    Character Level
                  </Label>
                  <Card id="level" className="py-2 px-2 text-sm text-center">
                    {userData?.level || 0}
                  </Card>
                </div>

                <div className="flex-[1] flex flex-col gap-2">
                  <Label htmlFor="xp" className="mx-2 text-xs sm:text-sm">
                    XP
                  </Label>
                  <Card id="xp" className="py-2 px-2 text-sm text-center">
                    {userData?.xp || 0}
                  </Card>
                </div>
              </div>
            </div>
            <div className="m-y-6 space-y-2 flex flex-col">
              <Label className="text-xs sm:text-sm">Character Preview</Label>
              <div className="flex flex-col p-3 sm:p-4 items-center justify-center rounded-md border border-border bg-card/50">
                <div className="text-center">
                  <div className="mb-2 text-base sm:text-xl font-bold">
                    {userData?.username}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground capitalize">
                    {userData?.class}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full justify-center sm:justify-between items-center px-4 sm:px-10 mt-6 sm:mt-10 gap-3 sm:gap-2">
                  {["left", "down", "up", "right"].map((direction) => {
                    return (
                      <div key={direction} className="flex-shrink-0">
                        <CharacterCard direction={direction} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
