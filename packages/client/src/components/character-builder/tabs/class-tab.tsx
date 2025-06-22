import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAtom } from "jotai";
import { displayDataAtom, userDataAtom } from "@/state/userAtom";
import { IClass } from "@backend/database/models/class.model";
import { useEffect, useState } from "react";
import { fetchClasses } from "@/utils/fetchClassesData";
import { ClassCard } from "../class-card";
import { AbilityScoreType } from "@backend/game/modules/abilityScores/abilityScores";

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

      console.log("Primary: ", attribute)
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
    </div>
  );
};
