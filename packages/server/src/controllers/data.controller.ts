import express from "express";
import { dataStore } from "../data/dataStore";
import { IClass } from "../database/models/class.model";

export const getAllClasses = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const classes: IClass[] = dataStore.getClassesList();
    return response.json({
      message: "success",
      data: classes,
    });
  } catch (error) {
    return response.status(400).json({
      message: "Failed to retrieve classes",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
