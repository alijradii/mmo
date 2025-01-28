import express from "express";
import { PlayerModel, IPlayer } from "../database/models/player.model";

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

export const createUser = async (req: any, res: express.Response) => {
  const id: string = req.auth.id;
  const username: string = req.auth.username;

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

  if (!head || !top || !bottom || !weapon)
    res.status(400).json({ status: "failed", error: "bad request" });
  
  findOrCreatePlayer(id, username)

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

  await PlayerModel.updateOne({ _id: id }, player.toObject());

  res.json({ status: "success" });
};
