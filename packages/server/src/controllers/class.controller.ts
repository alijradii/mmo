import express from "express";
import classModel, { IClass } from "../database/models/class.model";
import { dataStore } from "../data/dataStore";

export const getAllClasses = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const classes: IClass[] = await classModel.find({});

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

export const addOrUpdateClass = async (
  request: express.Request,
  response: express.Response
) => {
  const classData = (request as any).body as IClass;

  if (!classData) {
    return response.status(400).json({ message: "invalid class" });
  }

  try {
    const updatedClass = await classModel.findOneAndUpdate(
      { _id: classData._id },
      classData,
      { upsert: true, new: true }
    );

    await dataStore.loadClasses();

    console.log(`Class ${classData._id} has been added/updated.`);
    return response.json({
      success: true,
      data: updatedClass,
    });
  } catch (error: any) {
    console.log(error.message);
    return response.status(400).json({
      success: false,
      message: "Failed to add or update class",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const deleteClass = async (
  request: express.Request,
  response: express.Response
) => {
  const id = request.body.id;

  try {
    const result = await classModel.deleteOne({ _id: id });

    await dataStore.loadClasses();

    return response.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return response.json({
      success: false,
      message: "Failed to delete class",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

