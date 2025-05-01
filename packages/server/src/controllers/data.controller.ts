import express from "express";
import { dataStore } from "../data/dataStore";
import { IClass } from "../database/models/class.model";

export const getAllClasses = async (
  request: express.Request,
  response: express.Response
) => {
  const classes: IClass[] = dataStore.getClassesList();
  return response.json(classes);
};
