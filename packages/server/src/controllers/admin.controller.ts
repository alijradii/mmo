import express, { response } from "express";
import itemModel, { Item } from "../database/models/item.model";

export const getAllItems = async (request: express.Request, response: express.Response) => {
  try {
    const items: Item[] = await itemModel.find({});
    console.log("Found " + items.length + " items");
    return response.json({
      message: "success",
      data: items,
    });
  } catch (error) {
    return response.status(400).json({
      message: "Failed to retrieve items",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const addOrUpdateItem = async (
  request: express.Request,
  response: express.Response
) => {
  const itemData = (request as any).body as Item;

  if (!itemData) {
    return response.status(400).json({ message: "invalid item" });
  }

  try {
    const updatedItem = await itemModel.findOneAndUpdate(
      { _id: itemData._id },
      itemData,
      { upsert: true, new: true }
    );

    console.log(`Item ${updatedItem.name} has been added/updated.`);
    return response.json({
      success: true,
      data: updatedItem,
    });
  } catch (error: any) {
    console.log(error.message);
    return response.status(400).json({
      success: false,
      message: "Failed to add or update item",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const deleteItem = async (request: express.Request, response: express.Response) => {
  const id = request.body.id;

  try {
    const result = await itemModel.deleteOne({ _id: id });

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
