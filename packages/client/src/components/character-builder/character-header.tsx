import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { displayDataAtom, userDataAtom } from "@/state/userAtom";
import { resetCharacterData, updateUserData } from "@/utils/updateUserData";
import { toast } from "@/hooks/use-toast";
import { validateDisplayData } from "./utils/validateDisplayData";
import { IPlayer } from "@backend/database/models/player.model";
import { ResetCharacterButton } from "./reset-character-button";

export const CharacterHeader: React.FC = () => {
  const [userData, setUserData] = useAtom(userDataAtom);
  const [displayData, setDisplayData] = useAtom(displayDataAtom);

  const onSubmit = async () => {
    if (!displayData) return;

    console.log(userData);

    const validate = validateDisplayData(displayData);
    if (validate.status === "fail") {
      toast({
        title: "Error",
        description: validate.message,
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await updateUserData(displayData);
      console.log("Success:", response.data.data);

      const partialData: Partial<IPlayer> = response.data.data;

      setUserData({
        ...displayData,
        ...partialData,
      });

      setDisplayData({
        ...displayData,
        ...partialData,
      });

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
        variant: "destructive",
      });
    }
  };

  const onDelete = async () => {
    if (!displayData) return;

    try {
      const response = await resetCharacterData();
      console.log("Success:", response.data.data);

      const partialData: Partial<IPlayer> = response.data.data;

      setUserData({
        ...displayData,
        ...partialData,
      });

      setDisplayData({
        ...displayData,
        ...partialData,
      });

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
        variant: "destructive",
      });
    }
  };

  return (
    <header className="border-b bg-card px-4 py-3 lg:px-10 lg:py-5">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">Character Builder</h1>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            Points: {displayData?.points || 0}
          </Badge>
          <Button size="sm" onClick={() => onSubmit()}>
            Save Character
          </Button>

          <ResetCharacterButton
            onSubmit={() => {
              onDelete();
            }}
          />
          <Button size="sm" variant={"outline"} asChild>
            <a href="/">Home</a>
          </Button>
        </div>
      </div>
    </header>
  );
};
