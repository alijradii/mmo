import express from "express";
import { PlayerModel } from "../database/models/player.model";
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
            head: "",
            top: "",
            bottom: "",
            weapon: "",
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

export const editUserGear = async (
  req: express.Request,
  res: express.Response
) => {
  const id: string = (req as any).auth.id;
  const username: string = (req as any).auth.username;

  if (!id || !username)
    res
      .status(400)
      .json({ status: "failed", error: "discord profile not found" });

  const {
    frontextra,
    head,
    hair,
    hat,
    backhair,
    top,
    bottom,
    weapon,
  }: { [index: string]: string } = req.body;

  let invalidInput = false;
  if (!head || !top || !bottom || !weapon) invalidInput = true;

  if (
    !PlayerComponents.head.includes(head) ||
    !PlayerComponents.top.includes(top) ||
    !PlayerComponents.bottom.includes(bottom) ||
    (hair !== "" && !PlayerComponents.hair.includes(hair)) ||
    (hat !== "" && !PlayerComponents.hat.includes(hat)) ||
    (frontextra !== "" && !PlayerComponents.frontextra.includes(frontextra)) ||
    (backhair !== "" && !PlayerComponents.backhair.includes(backhair))
  )
    invalidInput = true;

  if (invalidInput){
    res.status(400).json({ status: "failed", error: "bad request" });
    return;
  }

  findOrCreatePlayer(id, username);

  const player = new PlayerModel({
    gear: {
      frontextra,
      head,
      hair,
      backhair,
      hat,
      top,
      bottom,
      weapon,
    },
  });

  await PlayerModel.findOneAndUpdate({ _id: id }, player.toObject());

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
      user = await findOrCreatePlayer(id, username)
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
