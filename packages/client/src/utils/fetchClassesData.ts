import { IClass } from "@backend/database/models/class.model";
import axios from "axios";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:4070";

export const fetchClasses = async (): Promise<IClass[]> => {
  const token = localStorage.getItem("colyseus-auth-token");

  if (!token) throw new Error("token not found");

  const response = await axios.get(`${backendUrl}/api/classes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(response.data);
  return response.data.data;
};

export const updateOrCreateClass = async (classData: IClass) => {
  const token = localStorage.getItem("colyseus-auth-token");

  if (!token) throw new Error("token not found");

  const response = await axios.post(`${backendUrl}/admin/class`, classData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteClass = async (id: string) => {
  const token = localStorage.getItem("colyseus-auth-token");

  if (!token) throw new Error("token not found");

  const response = await axios.post(
    `${backendUrl}/admin/class/delete`,
    { id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
