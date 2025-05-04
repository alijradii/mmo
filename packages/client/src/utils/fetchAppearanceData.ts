import { IPlayer } from "@backend/database/models/player.model";
import { fetchSelfData } from "@/utils/fetchUserData";

export const fetchAppearanceData = async (): Promise<
  Record<string, string>
> => {
  const u: IPlayer = await fetchSelfData();
  if (!u) throw new Error("user not found");

  const swap: Record<string, string> = {
    head: u.appearance.head,
    top: u.appearance.top,
    bottom: u.appearance.bottom,
    weapon: u.appearance.weapon,
    hat: u.appearance.hat,
    hair: u.appearance.hair,
    frontextra: u.appearance.frontextra,
    backhair: u.appearance.backhair,
  };

  return swap;
};
