import { IWeapon } from "@backend/database/models/weapon.model";
import axios from "axios";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:4070";

export const fetchWeapons = async (): Promise<IWeapon[]> => {
  const token = localStorage.getItem("colyseus-auth-token");

  if (!token) throw new Error("token not found");

  const response = await axios.get(`${backendUrl}/api/weapons`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(response.data);
  return response.data.data;
};

export const updateOrCreateWeapon = async (weapon: IWeapon) => {
  const token = localStorage.getItem("colyseus-auth-token");

  if (!token) throw new Error("token not found");

  const response = await axios.post(`${backendUrl}/admin/weapon`, weapon, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteWeapon = async (id: string) => {
  const token = localStorage.getItem("colyseus-auth-token");

  if (!token) throw new Error("token not found");

  const response = await axios.post(`${backendUrl}/admin/weapon/delete`, {id}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
