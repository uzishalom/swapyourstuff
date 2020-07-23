import httpClient from "./api-client";
import { apiUrl } from "../config/config.json";

export const addItem = async (data) => {
    await httpClient.post(`${apiUrl}/items/additem`, data);
}

export const getCategories = async () => {
    const { data } = await httpClient.get(`${apiUrl}/categories`);
    return data.categories;
}




export default {
    addItem,
    getCategories,
}