import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { classes, getClassEquipment, getClassAbilities } from "../data/classes";
import { useAtom } from "jotai";
import { userDataAtom } from "@/state/userAtom";
import { IPlayer } from "@backend/database/models/player.model";

export const ClassTab: React.FC = () => {
  const [userData, setUserData] = useAtom(userDataAtom);

  const handleClassSelect = (selectedClass: string) => {
    if (userData) {
      const data: IPlayer = userData;
      setUserData({ ...data, class: selectedClass });
    }
  };

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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {classes.map((classItem) => (
              <Card
                key={classItem.id}
                className={`cursor-pointer transition-all hover:border-primary ${
                  userData?.class === classItem.id
                    ? "border-2 border-primary"
                    : ""
                }`}
                onClick={() => handleClassSelect(classItem.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={classItem.icon || "/placeholder.svg"}
                      alt={classItem.name}
                      width={40}
                      height={40}
                      className="rounded-full border border-border"
                    />
                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="mb-2 text-sm text-muted-foreground">
                    {classItem.description}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    Primary: {classItem.primaryStat}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {userData?.class && (
        <Card>
          <CardHeader>
            <CardTitle>
              {classes.find((c) => c.id === userData.class)?.name} Class Details
            </CardTitle>
            <CardDescription>Special abilities and traits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold">Starting Equipment</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {getClassEquipment(userData.class).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Class Abilities</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {getClassAbilities(userData.class).map((ability, index) => (
                    <li key={index}>{ability}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
