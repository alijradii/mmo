import express, { response } from "express";
import weaponModel, { IWeapon } from "../database/models/weapon.model";
import { dataStore } from "../data/dataStore";

export const getAllWeapons = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const weapons: IWeapon[] = await weaponModel.find({});

    return response.json({
      message: "success",
      data: weapons,
    });
  } catch (error) {
    return response.status(400).json({
      message: "Failed to retrieve weapons",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const addOrUpdateWeapon = async (
  request: express.Request,
  response: express.Response
) => {
  const weaponData = (request as any).body as IWeapon;

  if (!weaponData) {
    return response.status(400).json({ message: "invalid item" });
  }

  try {
    const updatedItem = await weaponModel.findOneAndUpdate(
      { _id: weaponData._id },
      weaponData,
      { upsert: true, new: true }
    );

    await dataStore.loadWeapons();

    console.log(`Weapon ${weaponData.name} has been added/updated.`);
    return response.json({
      success: true,
      data: updatedItem,
    });
  } catch (error: any) {
    console.log(error.message);
    return response.status(400).json({
      success: false,
      message: "Failed to add or update weapon",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const deleteWeapon = async (
  request: express.Request,
  response: express.Response
) => {
  const id = request.body.id;

  try {
    const result = await weaponModel.deleteOne({ _id: id });

    await dataStore.loadWeapons();

    return response.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return response.json({
      success: false,
      message: "Failed to delete item",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
