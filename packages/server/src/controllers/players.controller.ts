import express from "express";
import { dataStore } from "../data/dataStore";
import { IPlayer, PlayerModel } from "../database/models/player.model";

export const getAllPlayers = async (request: express.Request, response: express.Response) => {
    try {
        const players: IPlayer[] = await PlayerModel.find({});

        return response.json({
            message: "success",
            data: players,
        });
    } catch (error) {
        return response.status(400).json({
            message: "Failed to retrieve players",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

export const getPlayerById = async (request: express.Request, response: express.Response) => {
    const { id } = request.params;

    try {
        const player = await PlayerModel.findById(id);

        if (!player) {
            return response.status(404).json({ message: "Player not found" });
        }

        return response.json({
            message: "success",
            data: player,
        });
    } catch (error) {
        return response.status(400).json({
            message: "Failed to retrieve player",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

export const updatePlayer = async (request: express.Request, response: express.Response) => {
    const playerData = request.body as IPlayer;

    if (!playerData || !playerData._id) {
        return response.status(400).json({ message: "Invalid player data" });
    }

    try {
        // Validate class if provided
        if (playerData.class) {
            const classes = dataStore.getClassesList().map(c => c._id);
            if (!classes.includes(playerData.class)) {
                return response.status(400).json({ message: "Invalid class" });
            }
        }

        // Validate race if provided
        if (playerData.race) {
            const validRaces = ["elf", "human", "dwarf", "orc"];
            if (!validRaces.includes(playerData.race)) {
                return response.status(400).json({ message: "Invalid race" });
            }
        }

        const updatedPlayer = await PlayerModel.findByIdAndUpdate(playerData._id, playerData, {
            new: true,
            runValidators: true,
        });

        if (!updatedPlayer) {
            return response.status(404).json({ message: "Player not found" });
        }

        console.log(`Player ${updatedPlayer.username} has been updated.`);
        return response.json({
            success: true,
            data: updatedPlayer,
        });
    } catch (error: any) {
        console.log(error.message);
        return response.status(400).json({
            success: false,
            message: "Failed to update player",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

export const deletePlayer = async (request: express.Request, response: express.Response) => {
    const { id } = request.body;

    if (!id) {
        return response.status(400).json({ message: "Player ID is required" });
    }

    try {
        const result = await PlayerModel.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return response.status(404).json({ message: "Player not found" });
        }

        return response.json({
            success: true,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        return response.json({
            success: false,
            message: "Failed to delete player",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
