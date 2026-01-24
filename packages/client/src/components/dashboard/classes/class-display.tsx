import { Card } from "@/components/ui/card";
import { IClass } from "@backend/database/models/class.model";

interface ClassDisplayProps {
  classItem: IClass;
  onClick: () => void;
}

export const ClassDisplay: React.FC<ClassDisplayProps> = ({
  classItem,
  onClick,
}) => {
  return (
    <Card
      className="p-4 cursor-pointer hover:bg-muted transition"
      onClick={onClick}
    >
      <div className="font-semibold">{classItem._id}</div>
      <div className="text-sm text-gray-500">{classItem.description}</div>
      <div className="text-xs text-gray-400 mt-1">
        HP: {classItem.hitpoints} | Speed: {classItem.speed}
      </div>
    </Card>
  );
};

