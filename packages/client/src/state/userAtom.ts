import { fetchSelfData } from "@/utils/fetchUserData";
import { IPlayer } from "@backend/database/models/player.model";
import { atom } from "jotai";

export const userDataAtom = atom<IPlayer | null>(null);

export const displayDataAtom = atom<IPlayer | null>(null);

// Async atom to load the user data
export const fetchUserDataAtom = atom(
  null, // no initial read needed
  async (_, set) => {
    const data = await fetchSelfData();
    set(userDataAtom, data);
    set(displayDataAtom, data);
  }
);
