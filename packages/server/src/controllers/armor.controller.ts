import express from "express";
import armorModel, { IArmor } from "../database/models/armor.model";
import { dataStore } from "../data/dataStore";

export const getAllArmor = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const armor: IArmor[] = await armorModel.find({});

    return response.json({
      message: "success",
      data: armor,
    });
  } catch (error) {
    return response.status(400).json({
      message: "Failed to retrieve armor",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const addOrUpdateArmor = async (
  request: express.Request,
  response: express.Response
) => {
  const armorData = (request as any).body as IArmor;

  if (!armorData) {
    return response.status(400).json({ message: "invalid armor" });
  }

  try {
    const updatedItem = await armorModel.findOneAndUpdate(
      { _id: armorData._id },
      armorData,
      { upsert: true, new: true }
    );

    await dataStore.loadArmor();

    console.log(`Armor ${armorData.name} has been added/updated.`);
    return response.json({
      success: true,
      data: updatedItem,
    });
  } catch (error: any) {
    console.log(error.message);
    return response.status(400).json({
      success: false,
      message: "Failed to add or update armor",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const deleteArmor = async (
  request: express.Request,
  response: express.Response
) => {
  const id = request.body.id;

  try {
    const result = await armorModel.deleteOne({ _id: id });

    await dataStore.loadArmor();

    return response.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return response.json({
      success: false,
      message: "Failed to delete armor",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
