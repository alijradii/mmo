import { IPlayer } from "@backend/database/models/player.model";
import { fetchSelfData } from "@/utils/fetchUserData";

export const fetchAppearanceData = async (): Promise<
  Record<string, string>
> => {
  const u: IPlayer = await fetchSelfData();
  if (!u) throw new Error("user not found");

  const swap: Record<string, string> = {
    head: u.gear.head,
    top: u.gear.top,
    bottom: u.gear.bottom,
    weapon: u.gear.weapon,
    hat: u.gear.hat,
    hair: u.gear.hair,
    frontextra: u.gear.frontextra,
    backhair: u.gear.backhair,
  };

  return swap;
};
