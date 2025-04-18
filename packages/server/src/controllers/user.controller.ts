import express from "express";

import { IPlayer, PlayerModel } from "../database/models/player.model";
import { IMember, MemberModel } from "../database/models/member.model";

import { PlayerComponents } from "../schemas/player/playerComponents";

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
          STR: 0,
          DEX: 0,
          INT: 0,
          WIS: 0,
          CHA: 0,
          CON: 0,
          gear: {
            frontextra: "",
            backhair: "",
            hair: "",
            hat: "",
            head: "head1",
            top: "top1",
            bottom: "bottom1",
            weapon: "axe1",
          },
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

export const validateGear = (gear: { [index: string]: string }) => {
  const {
    frontextra = "",
    head = "",
    hair = "",
    hat = "",
    backhair = "",
    top = "",
    bottom = "",
    weapon = "",
  } = gear;

  if (!head || !top || !bottom || !weapon) return false;

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

export const validateStats = (user: IPlayer): boolean => {
  const sum =
    user.STR +
    user.DEX +
    user.CON +
    user.CHA +
    user.INT +
    user.WIS +
    user.points;
  return sum === 70;
};

export const validateClass = (cl: string): boolean => {
  return ["warrior", "mage", "rogue", "cleric"].indexOf(cl) !== -1;
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

  const gear: { [index: string]: string } = req.body;

  const isValid = validateGear(gear);

  if (!isValid) {
    return res.status(400).json({ status: "failed", error: "bad request" });
  }

  const player: IPlayer = await findOrCreatePlayer(id, username);
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
  const username: string = (req as any).auth.username;
  const userData = (req as any).data;

  let user: IPlayer | null = null;

  try {
    if (!id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    user = await PlayerModel.findById(id);
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    res.status(500).json({ message: "Internal server error" });
  }

  if (!user) return res.status(404).json({ message: "User not found" });

  if (!validateGear(user.gear))
    return res.status(404).json({ message: "Gear is invalid." });

  if (!validateStats(user))
    return res.status(404).json({ message: "Ability scores are invalid." });

  if (!validateClass(user.class))
    return res.status(404).json({ message: "Invalid class." });

  if (!validateRace(user.race))
    return res.status(404).json({ message: "Invalid race." });

  await PlayerModel.findOneAndUpdate(
    { _id: id },
    {
      STR: user.STR,
      DEX: user.DEX,
      INT: user.INT,
      CON: user.CON,
      WIS: user.WIS,
      CHA: user.CHA,
      points: user.points,
      class: user.class,
      race: user.race,
    }
  );

  return res.status(200).json({ message: "success" });
};
