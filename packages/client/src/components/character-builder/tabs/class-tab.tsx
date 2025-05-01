import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getClassEquipment, getClassAbilities } from "../data/classes";
import { useAtom } from "jotai";
import { displayDataAtom, userDataAtom } from "@/state/userAtom";
import { IClass } from "@backend/database/models/class.model";
import { useEffect, useState } from "react";
import { fetchClasses } from "@/utils/fetchClassesData";
import { ClassCard } from "../class-card";
import { AbilityScoreType } from "@backend/schemas/modules/abilityScores/abilityScores";

export const ClassTab: React.FC = () => {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [userData] = useAtom(userDataAtom);
  const [displayData, setDisplayData] = useAtom(displayDataAtom);

  const handleClassSelect = (selectedClass: string) => {
    if (userData && userData.class) {
      return;
    } else if (userData && displayData && selectedClass !== displayData.class) {
      const classData: IClass | undefined = classes.find(
        (cl) => cl._id === selectedClass
      );
      let attribute: AbilityScoreType | "" = "";

      if (classData && classData.keyAbilities.length === 1) {
        attribute = classData.keyAbilities[0];
      } else if (classData) {
        attribute = "";
      }

      setDisplayData({
        ...displayData,
        class: selectedClass,
        primaryAttribute: attribute,
      });
    }
  };

  useEffect(() => {
    fetchClasses().then((cl) => setClasses(cl));
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Class</CardTitle>
          <CardDescription>
            Your class determines your combat style and abilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((classItem) => (
              <ClassCard
                key={classItem._id}
                selected={classItem._id === displayData?.class}
                classItem={classItem}
                onSelect={handleClassSelect}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {userData?.class && (
        <Card>
          <CardHeader>
            <CardTitle>
              {classes.find((c) => c._id === displayData?.class)?._id} Class
              Details
            </CardTitle>
            <CardDescription>Special abilities and traits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold">Starting Equipment</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {getClassEquipment(displayData?.class || "").map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Class Abilities</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {getClassAbilities(displayData?.class || "").map(
                    (ability, index) => (
                      <li key={index}>{ability}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
