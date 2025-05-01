import { IClass } from "@backend/database/models/class.model";
import axios from "axios"

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:4070";

export const fetchClasses = async (): Promise<IClass[]> => {
  const token = localStorage.getItem("colyseus-auth-token");

  if (!token) throw new Error("token not found");

  const response = await axios.get(`${backendUrl}/api/classes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
