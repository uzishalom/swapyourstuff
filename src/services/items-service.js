import httpClient from "./api-client";
import { apiUrl } from "../config/config.json";
import path from "path";




export const addItem = async (data, fileToUpload) => {

    // save details
    const response = await httpClient.post(`${apiUrl}/items/additem`, data);

    //upload image
    if (fileToUpload) {
        const formData = new FormData();
        formData.append("file", fileToUpload);
        const reqDetails = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'itemId': response.data.newItemId,
                'fileExt': path.extname(fileToUpload.name).toLowerCase(),
            }
        };
        await httpClient.post(`${apiUrl}/items/uploaditemimage`, formData, reqDetails);
    }
}



export const getCategories = async () => {
    const { data } = await httpClient.get(`${apiUrl}/categories`);
    return data.categories;
}

export const getUserItems = async () => {
    const { data } = await httpClient.get(`${apiUrl}/items/useritems`);
    return data.userItems;
}


export default {
    addItem,
    getCategories,
    getUserItems,
}