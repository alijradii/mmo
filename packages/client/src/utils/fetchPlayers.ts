import { IPlayer } from "@backend/database/models/player.model";
import axios from "axios";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:4070";

export const fetchPlayers = async (): Promise<IPlayer[]> => {
  const token = localStorage.getItem("colyseus-auth-token");

  if (!token) throw new Error("token not found");

  const response = await axios.get(`${backendUrl}/admin/players`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const fetchPlayerById = async (id: string): Promise<IPlayer> => {
  const token = localStorage.getItem("colyseus-auth-token");

  if (!token) throw new Error("token not found");

  const response = await axios.get(`${backendUrl}/admin/player/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const updatePlayer = async (player: IPlayer) => {
  const token = localStorage.getItem("colyseus-auth-token");

  if (!token) throw new Error("token not found");

  const response = await axios.post(`${backendUrl}/admin/player`, player, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deletePlayer = async (id: string) => {
  const token = localStorage.getItem("colyseus-auth-token");

  if (!token) throw new Error("token not found");

  const response = await axios.post(
    `${backendUrl}/admin/player/delete`,
    { id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

