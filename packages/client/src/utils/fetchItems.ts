import { Item } from "@backend/database/models/item.model";
import axios from "axios";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:4070";

export const fetchItems = async (): Promise<Item[]> => {
  const token = localStorage.getItem("colyseus-auth-token");

  if (!token) throw new Error("token not found");

  const response = await axios.get(`${backendUrl}/admin/items`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(response.data);
  return response.data.data;
};

export const updateOrCreateItem = async (item: Item) => {
  const token = localStorage.getItem("colyseus-auth-token");

  if (!token) throw new Error("token not found");

  const response = await axios.post(`${backendUrl}/admin/item`, item, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteItem = async (id: string) => {
  const token = localStorage.getItem("colyseus-auth-token");

  if (!token) throw new Error("token not found");

  const response = await axios.post(`${backendUrl}/admin/item/delete`, {id}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
