import {Item} from "@backend/database/models/item.model"
import axios from "axios"

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:4070";

export const fetchItems = async () :Promise<Item[]>=> {
    const token = localStorage.getItem('colyseus-auth-token')
    
    if(!token)
        throw new Error("token not found")

    console.log(backendUrl)
    const response = await axios.get(`${backendUrl}/admin/items`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    
    return response.data;
}