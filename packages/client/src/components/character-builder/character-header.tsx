import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface CharacterHeaderProps {
  pointsRemaining: number
}

export const CharacterHeader: React.FC<CharacterHeaderProps> = ({ pointsRemaining }) => {
  return (
    <header className="border-b bg-card px-4 py-3 lg:px-10 lg:py-5">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">Character Builder</h1>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            Points: {pointsRemaining}
          </Badge>
          <Button size="sm">Save Character</Button>
          <Button size="sm" variant={"outline"} asChild>
            <a href="/">Home</a>
          </Button>
        </div>
      </div>
    </header>
  )
}
