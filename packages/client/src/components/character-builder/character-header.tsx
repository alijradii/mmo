import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { userDataAtom } from "@/state/userAtom";
import { updateUserData } from "@/utils/updateUserData";
import { toast } from "@/hooks/use-toast";

interface CharacterHeaderProps {
  pointsRemaining: number;
}

export const CharacterHeader: React.FC<CharacterHeaderProps> = ({
  pointsRemaining,
}) => {
  const [userData] = useAtom(userDataAtom);

  const onSubmit = async () => {
    if (!userData) return;
    
    console.log(userData)

    try {
      const response = await updateUserData(userData);
      console.log("Success:", response);

      toast({
        title: "Success",
        description: "Successfully updated your player information!",
      });

    } catch (error: any) {
      let errorMessage = "Something went wrong.";
      if (error.response && error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error("Update failed:", errorMessage);
      toast({
        title: "Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <header className="border-b bg-card px-4 py-3 lg:px-10 lg:py-5">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">Character Builder</h1>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            Points: {pointsRemaining}
          </Badge>
          <Button size="sm" onClick={() => onSubmit()}>
            Save Character
          </Button>
          <Button size="sm" variant={"outline"} asChild>
            <a href="/">Home</a>
          </Button>
        </div>
      </div>
    </header>
  );
};
