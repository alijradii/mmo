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
import { Check } from "lucide-react";
import { classes } from "../data/classes";
import { races } from "../data/races";
import { feats } from "../data/feats";
import { CharacterCard } from "@/components/character-card";
import { useAtom } from "jotai";
import { userDataAtom } from "@/state/userAtom";

export const BasicsTab: React.FC = () => {
  const selectedFeats = ["Alert"];
  const [userData] = useAtom(userDataAtom);

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
                  <Card id="name" className="py-2 px-2">
                    {userData?.username}
                  </Card>
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
                  <div className="text-sm text-muted-foreground">
                    {userData?.race &&
                      races.find((r) => r.id === userData.race)?.name}{" "}
                    {userData?.class &&
                      classes.find((c) => c.id === userData.class)?.name}
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

      <Card>
        <CardHeader>
          <CardTitle>Character Summary</CardTitle>
          <CardDescription>
            Overview of your character's current build
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Selected Race</h3>
                {userData?.race ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        races.find((r) => r.id === userData.race)?.icon ||
                        "/placeholder.svg"
                      }
                      alt={
                        races.find((r) => r.id === userData.race)?.name || ""
                      }
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span>
                      {races.find((r) => r.id === userData.race)?.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No race selected
                  </span>
                )}
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Selected Class</h3>
                {userData?.class ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        classes.find((c) => c.id === userData.class)?.icon ||
                        "/placeholder.svg"
                      }
                      alt={
                        classes.find((c) => c.id === userData.class)?.name || ""
                      }
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span>
                      {classes.find((c) => c.id === userData.class)?.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No class selected
                  </span>
                )}
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">
                Selected Feats ({selectedFeats.length}/3)
              </h3>
              {selectedFeats.length > 0 ? (
                <div className="space-y-2">
                  {selectedFeats.map((featId) => (
                    <div key={featId} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feats.find((f) => f.id === featId)?.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  No feats selected
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
