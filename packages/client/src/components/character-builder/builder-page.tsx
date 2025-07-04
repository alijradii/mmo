import type React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CharacterHeader } from "./character-header";
import { BasicsTab } from "./tabs/basics-tab";
import { ClassTab } from "./tabs/class-tab";
import { AbilitiesTab } from "./tabs/abilities-tab";
import { FeatsTab } from "./tabs/feats-tab";
import { CharacterFooter } from "./character-footer";
import { useCharacterState } from "./use-character-state";
import { calculateSecondaryStats } from "./utils/stat-calculations";
import { userDataAtom, fetchUserDataAtom, displayDataAtom, classesDataAtom } from "@/state/userAtom";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { GeneratorPage } from "@/pages/generator";
import { EquipmentTab } from "./tabs/equipment-tab";

export const BuilderPageComponent: React.FC = () => {
  const { selectedFeats, setSelectedFeats } = useCharacterState();

  const [userData] = useAtom(userDataAtom);
  const [displayData] = useAtom(displayDataAtom);
  const [classesData] = useAtom(classesDataAtom);

  const [, fetchUser] = useAtom(fetchUserDataAtom);

  useEffect(() => {
    fetchUser().then(() => {
      console.log("user data: ");
      console.log(userData?.["gear"]);
    });
  }, []);

  const secondaryStats = calculateSecondaryStats(displayData, classesData);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <CharacterHeader />

      <main className="container mx-auto flex-1 p-4">
        <Tabs defaultValue="basics" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="class">Class</TabsTrigger>
            <TabsTrigger value="abilities">Abilities</TabsTrigger>
            {/* <TabsTrigger value="equipment">Equipment</TabsTrigger> */}
            {/* <TabsTrigger value="feats">Feats</TabsTrigger> */}
          </TabsList>

          <TabsContent value="basics">
            <BasicsTab />
          </TabsContent>

          <TabsContent value="class">
            <ClassTab />
          </TabsContent>

          <TabsContent value="abilities">
            <AbilitiesTab secondaryStats={secondaryStats} />
          </TabsContent>

          <TabsContent value="feats">
            <FeatsTab
              selectedFeats={selectedFeats}
              setSelectedFeats={setSelectedFeats}
            />
          </TabsContent>

          <TabsContent value="appearance">
            <GeneratorPage />
          </TabsContent>

          <TabsContent value="equipment">
            <EquipmentTab />
          </TabsContent>
        </Tabs>
      </main>

      <CharacterFooter />
    </div>
  );
};
