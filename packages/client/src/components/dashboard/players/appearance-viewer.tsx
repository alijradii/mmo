import { CharacterCard } from "@/components/character-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IPlayer } from "@backend/database/models/player.model";
import { useState } from "react";

interface AppearanceViewerProps {
    player: IPlayer;
}

export const AppearanceViewer: React.FC<AppearanceViewerProps> = ({ player }) => {
    const [selectedDirection, setSelectedDirection] = useState<"down" | "left" | "right" | "up">("down");

    // Merge appearance with equipped weapon from gear
    const fullAppearance = {
        ...player.appearance,
        weapon: player.gear?.weapon?.itemId || player.appearance.weapon || "",
    };

    const directionLabels = {
        down: "Front View",
        left: "Left Side",
        right: "Right Side",
        up: "Back View",
    };

    return (
        <div className="space-y-6">
            {/* Character Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Character Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{player.username}</div>
                            <div className="flex gap-2 justify-center mt-2">
                                <Badge variant="outline" className="capitalize">
                                    {player.race || "No Race"}
                                </Badge>
                                <Badge variant="outline" className="capitalize">
                                    {player.class || "No Class"}
                                </Badge>
                                <Badge>Level {player.level}</Badge>
                            </div>
                        </div>

                        {/* Appearance Details */}
                        <div className="grid grid-cols-2 gap-2 text-sm border-t pt-4 mt-4">
                            {Object.entries(fullAppearance).map(([key, value]) => {
                                if (!value) return null;
                                return (
                                    <div key={key} className="flex justify-between">
                                        <span className="text-muted-foreground capitalize">{key}:</span>
                                        <span className="font-mono text-xs">{value}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 4-Direction View */}
            <Card>
                <CardHeader>
                    <CardTitle>360° Character View</CardTitle>
                    <p className="text-sm text-muted-foreground">Click on any view to see it enlarged below</p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(["down", "left", "right", "up"] as const).map(direction => (
                            <div
                                key={direction}
                                className="space-y-2 cursor-pointer"
                                onClick={() => setSelectedDirection(direction)}
                            >
                                <div className="text-sm font-medium text-center text-muted-foreground">
                                    {directionLabels[direction]}
                                </div>
                                <div className={`transition-all`}>
                                    <CharacterCard direction={direction} appearance={fullAppearance} scale={2} />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Large Preview */}
            <Card>
                <CardHeader>
                    <CardTitle>Large Preview - {directionLabels[selectedDirection]}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center">
                        <CharacterCard direction={selectedDirection} appearance={fullAppearance} scale={4} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
