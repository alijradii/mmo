"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { feats } from "../data/feats"

interface FeatsTabProps {
  selectedFeats: string[]
  setSelectedFeats: (feats: string[]) => void
}

export const FeatsTab: React.FC<FeatsTabProps> = ({ selectedFeats, setSelectedFeats }) => {
  const handleFeatToggle = (featId: string) => {
    if (selectedFeats.includes(featId)) {
      setSelectedFeats(selectedFeats.filter((id) => id !== featId))
    } else {
      if (selectedFeats.length < 3) {
        setSelectedFeats([...selectedFeats, featId])
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Your Feats</CardTitle>
        <CardDescription>Select up to 3 feats to enhance your character's abilities</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {feats.map((feat) => (
              <Card
                key={feat.id}
                className={`cursor-pointer transition-all hover:border-primary ${
                  selectedFeats.includes(feat.id) ? "border-2 border-primary" : ""
                }`}
                onClick={() => handleFeatToggle(feat.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{feat.name}</CardTitle>
                  <CardDescription className="text-xs">Requirement: {feat.requirements}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">Selected: {selectedFeats.length}/3 feats</div>
      </CardFooter>
    </Card>
  )
}
