import type React from "react"

export const CharacterFooter: React.FC = () => {
  return (
    <footer className="border-t bg-card px-4 py-6">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold">NCNL MMO</h2>
            <p className="text-sm text-muted-foreground">Character Builder v1.0</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
