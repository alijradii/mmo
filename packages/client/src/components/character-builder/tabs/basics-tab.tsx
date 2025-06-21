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
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Character Basics</CardTitle>
          <CardDescription>
            General information about your character.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <div className="flex gap-4 w-full">
                <div className="flex-[2] flex flex-col gap-2">
                  <Label htmlFor="name" className="mx-2">
                    Character Name
                  </Label>
                  <Input
                    id="name"
                    className="py-2 px-2"
                    value={userData?.username}
                    onChange={(e) => {
                      if (userData)
                        setUserData({ ...userData, username: e.target.value });
                    }}
                  />
                </div>

                <div className="flex-[1] flex flex-col gap-2">
                  <Label htmlFor="level" className="mx-2">
                    Character Level
                  </Label>
                  <Card id="level" className="py-2 px-2">
                    {userData?.level || 0}
                  </Card>
                </div>

                <div className="flex-[1] flex flex-col gap-2">
                  <Label htmlFor="xp" className="mx-2">
                    XP
                  </Label>
                  <Card id="xp" className="py-2 px-2">
                    {userData?.xp || 0}
                  </Card>
                </div>
              </div>
            </div>
            <div className="m-y-6 space-y-2 flex flex-col">
              <Label>Character Preview</Label>
              <div className="flex flex-col p-4 items-center justify-center rounded-md border border-border bg-card/50">
                <div className="text-center">
                  <div className="mb-2 text-xl font-bold">
                    {userData?.username}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {userData?.class}
                  </div>
                </div>

                <div className="flex w-full justify-between px-10 mt-10">
                  {["left", "down", "up", "right"].map((direction) => {
                    return (
                      <div key={direction}>
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
