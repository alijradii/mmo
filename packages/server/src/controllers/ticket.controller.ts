import express from "express";
import { PlayerModel } from "../database/models/player.model";
import { matchMaker } from "colyseus";

export const getSeatReservation = async (
  request: express.Request,
  response: express.Response
) => {
  const id: string = (request as any).auth.id;

  const player = await PlayerModel.findById(id);

  if (!player) {
    response
      .status(400)
      .json({ status: "failed", message: "player does not exist" });
    return;
  }

  const reservation = await matchMaker.join(player.map, {
    x: player.x,
    y: player.y,
  });

  console.log("successfully reserved");

  response
    .status(200)
    .json({
      status: "success",
      message: "successfully created reservation",
      reservation,
    });
};
