import { IPlayer } from "@backend/database/models/player.model";

export interface ValidateDisplayDataResponse {
  status: "success" | "fail";
  message: string;
}

export const validateDisplayData = (
  data: IPlayer
): ValidateDisplayDataResponse => {
  if (!data.class) {
    return { status: "fail", message: "Please select a class." };
  }

  if (!data.primaryAttribute) {
    return { status: "fail", message: "Please select a primary attribute." };
  }

  return { message: "valid", status: "success" };
};
