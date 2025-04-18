import { IPlayer } from "@backend/database/models/player.model";
import axios from "axios";

export const updateUserData = async (userData: IPlayer) => {
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:4070";

  const response = await axios.post(`${backendUrl}/user/me`, userData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("colyseus-auth-token")}`,
    },
  });

  return response;
};
