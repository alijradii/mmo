import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { fetchClasses } from "@/utils/fetchClassesData";
import { IClass } from "@backend/database/models/class.model";
import { useEffect, useState } from "react";
import { ClassDisplay } from "./class-display";
import { ClassForm } from "./class-form";

export const ClassesDashboard: React.FC = () => {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [addingNewClass, setAddingNewClass] = useState(false);
  const [editingClass, setEditingClass] = useState<IClass | null>(null);

  useEffect(() => {
    fetchClasses().then((_classes: IClass[]) => {
      setClasses(_classes);
    });
  }, []);

  const handleAddNewClass = () => {
    setAddingNewClass(true);
    setEditingClass(null);
  };

  const handleChange = () => {
    fetchClasses().then((_classes: IClass[]) => {
      setClasses(_classes);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classes</CardTitle>
        <CardDescription>A list of all the classes in game.</CardDescription>
        <div className="mt-4">
          <Button onClick={handleAddNewClass}>New Class</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col w-full space-y-4">
          {/* ClassForm for adding or editing */}
          {(addingNewClass || editingClass) && (
            <ClassForm
              classItem={editingClass ?? undefined}
              onChange={() => handleChange()}
              onCancel={() => {
                setAddingNewClass(false);
                setEditingClass(null);
              }}
            />
          )}

          {/* List of classes */}
          {!addingNewClass && !editingClass && (
            <div className="grid gap-4">
              {classes.map((classItem) => (
                <ClassDisplay
                  key={classItem._id}
                  classItem={classItem}
                  onClick={() => {
                    setEditingClass(classItem);
                    setAddingNewClass(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

