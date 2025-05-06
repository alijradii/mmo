import express from "express";

import { IPlayer, PlayerModel } from "../database/models/player.model";
import { IMember, MemberModel } from "../database/models/member.model";

import { PlayerComponents } from "../schemas/player/playerComponents";
import { dataStore } from "../data/dataStore";
import { IClass } from "../database/models/class.model";

const findOrCreatePlayer = async (id: string, username: string) => {
  try {
    const player = await PlayerModel.findOneAndUpdate(
      { _id: id },
      {
        $setOnInsert: {
          _id: id,
          username,
          xp: 0,
          maxHp: 100,
          maxMp: 100,
          STR: 10,
          DEX: 10,
          INT: 10,
          WIS: 10,
          CHA: 10,
          CON: 10,
          appearance: {
            frontextra: "",
            backhair: "",
            hair: "",
            hat: "",
            head: "head1",
            top: "top1",
            bottom: "bottom1",
            weapon: "",
          },
          class: "",
          level: 1,
          primaryAttribute: "",
          race: "",
          points: 4,
          inventoryGrid: Array(36).fill({itemId: null, quantity: 0})
        },
      },
      { upsert: true, new: true }
    );

    return player;
  } catch (error) {
    console.error("Error in findOrCreatePlayer:", error);
    throw error;
  }
};

export const validateGear = (appearance: { [index: string]: string }) => {
  const {
    frontextra = "",
    head = "",
    hair = "",
    hat = "",
    backhair = "",
    top = "",
    bottom = "",
  } = appearance;

  if (!head || !top || !bottom) return false;

  if (
    !PlayerComponents.head.includes(head) ||
    !PlayerComponents.top.includes(top) ||
    !PlayerComponents.bottom.includes(bottom) ||
    (hair !== "" && !PlayerComponents.hair.includes(hair)) ||
    (hat !== "" && !PlayerComponents.hat.includes(hat)) ||
    (frontextra !== "" && !PlayerComponents.frontextra.includes(frontextra)) ||
    (backhair !== "" && !PlayerComponents.backhair.includes(backhair))
  ) {
    return false;
  }

  return true;
};

export const validateStats = (oldData: IPlayer, newData: IPlayer): boolean => {
  const oldSum =
    oldData.STR +
    oldData.DEX +
    oldData.CON +
    oldData.CHA +
    oldData.INT +
    oldData.WIS +
    oldData.points;
  const newSum =
    newData.STR +
    newData.DEX +
    newData.CON +
    newData.CHA +
    newData.INT +
    newData.WIS +
    newData.points;
  return oldSum === newSum;
};

export const validateClass = (cl: string): boolean => {
  const classes = dataStore.getClassesList().map((c: IClass) => c._id);

  return classes.indexOf(cl) !== -1;
};

export const validateRace = (race: string): boolean => {
  return ["elf", "human", "dwarf", "orc"].indexOf(race) !== -1;
};

export const editUserGear = async (
  req: express.Request,
  res: express.Response
) => {
  const id: string = (req as any).auth.id;
  const username: string = (req as any).auth.username;

  if (!id || !username)
    return res
      .status(400)
      .json({ status: "failed", error: "discord profile not found" });

  const appearance: { [index: string]: string } = req.body;

  const isValid = validateGear(appearance);

  if (!isValid) {
    return res.status(400).json({ status: "failed", error: "bad request" });
  }

  const player: IPlayer = await findOrCreatePlayer(id, username);
  player.appearance = { ...player.appearance, ...appearance };

  await PlayerModel.findOneAndUpdate({ _id: id }, player);

  res.json({ status: "success" });
};

export const getUser = async (req: any, res: express.Response) => {
  try {
    const { id } = req.params;
    const user = await PlayerModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMe = async (req: express.Request, res: express.Response) => {
  const id: string = (req as any).auth.id;
  const username: string = (req as any).auth.username;

  try {
    if (!id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let user = await PlayerModel.findById(id);
    if (!user) {
      // return res.status(404).json({ message: "User not found" });
      user = await findOrCreatePlayer(id, username);
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateMe = async (req: express.Request, res: express.Response) => {
  const id: string = (req as any).auth.id;

  if (!id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let user: IPlayer | null = null;
  let newInfo: IPlayer = req.body;

  try {
    user = await PlayerModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }

  if (!validateGear(newInfo.appearance))
    return res.status(400).json({ message: "Gear is invalid." });

  if (!validateStats(user, newInfo))
    return res.status(400).json({ message: "Ability scores are invalid." });

  if (!validateClass(newInfo.class))
    return res
      .status(400)
      .json({ message: `Invalid class. (${newInfo.class})` });

  if (user.class && user.class !== newInfo.class)
    return res
      .status(400)
      .json({ message: `You cannot change your class. (${newInfo.class})` });

  const updatedPlayer: Partial<IPlayer> = {
    STR: newInfo.STR,
    DEX: newInfo.DEX,
    INT: newInfo.INT,
    CON: newInfo.CON,
    WIS: newInfo.WIS,
    CHA: newInfo.CHA,
    points: newInfo.points,
    class: newInfo.class,
    appearance: { ...newInfo.appearance, weapon: user.appearance.weapon },
    primaryAttribute: newInfo.primaryAttribute,
  };

  if (user.class !== newInfo.class) {
    const primaryAttribute = newInfo.primaryAttribute;

    if (primaryAttribute) {
      updatedPlayer[primaryAttribute] = newInfo[primaryAttribute] + 2;
    }

    const chosenClass = dataStore.classes.get(newInfo.class);
    if (!chosenClass) {
      return res.status(400).json({
        message: `Something went wrong with class (${newInfo.class}). Please report`,
      });
    }

    if (updatedPlayer.appearance)
      updatedPlayer.appearance.weapon = chosenClass.startingWeapon;
  }

  await PlayerModel.findOneAndUpdate({ _id: id }, updatedPlayer);

  return res.status(200).json({ message: "success" , data: updatedPlayer});
};
