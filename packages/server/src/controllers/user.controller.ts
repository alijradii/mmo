import express from "express";
import { PlayerModel, IPlayer } from "../database/models/player.model";

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

  const player = new PlayerModel({
    _id: id,
    username,
    class: "warrior",
    xp: 0,
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

    STR: 0,
    DEX: 0,
    INT: 0,
    WIS: 0,
    CON: 0,
    CHA: 0,
  });

  await PlayerModel.replaceOne({ _id: id }, player.toObject(), {
    upsert: true,
  });

  res.json({ status: "success" });
};
