import { fetchClasses } from "@/utils/fetchClassesData";
import { fetchSelfData } from "@/utils/fetchUserData";
import { IClass } from "@backend/database/models/class.model";
import { IPlayer } from "@backend/database/models/player.model";
import { atom } from "jotai";

export const userDataAtom = atom<IPlayer | null>(null);

export const displayDataAtom = atom<IPlayer | null>(null);

export const classesDataAtom = atom<IClass[]>([]);

// Async atom to load the user data
export const fetchUserDataAtom = atom(
  null, // no initial read needed
  async (_, set) => {
    const data = await fetchSelfData();
    const classesData = await fetchClasses();

    set(userDataAtom, data);
    set(displayDataAtom, data);
    set(classesDataAtom, classesData);
  }
);
