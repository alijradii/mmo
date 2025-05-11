import { IArmor } from "@backend/database/models/armor.model";
import axios from "axios";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:4070";

export const fetchArmor = async (): Promise<IArmor[]> => {
  const token = localStorage.getItem("colyseus-auth-token");

  if (!token) throw new Error("token not found");

  const response = await axios.get(`${backendUrl}/api/armor`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(response.data);
  return response.data.data;
};

export const updateOrCreateArmor = async (weapon: IArmor) => {
  const token = localStorage.getItem("colyseus-auth-token");

  if (!token) throw new Error("token not found");

  const response = await axios.post(`${backendUrl}/admin/armor`, weapon, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteArmor = async (id: string) => {
  const token = localStorage.getItem("colyseus-auth-token");

  if (!token) throw new Error("token not found");

  const response = await axios.post(`${backendUrl}/admin/armor/delete`, {id}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
