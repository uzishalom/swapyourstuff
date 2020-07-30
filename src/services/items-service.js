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
        await httpClient.put(`${apiUrl}/items/uploaditemimage`, formData, reqDetails);
    }
}


export const addInterestingItems = async (data) => {
    await httpClient.post(`${apiUrl}/items/addinterestingitems`, data);
}


export const updateItem = async (data, fileToUpload) => {

    // save details
    const response = await httpClient.put(`${apiUrl}/items/updateitem`, data);

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
        await httpClient.put(`${apiUrl}/items/uploaditemimage`, formData, reqDetails);
    }
}

export const deleteInterestingItems = async (itemIds) => {
    await httpClient.delete(`${apiUrl}/items/deleteinterestingitems`, { itemIds });
}


export const getCategories = async () => {
    const { data } = await httpClient.get(`${apiUrl}/categories`);
    return data.categories;
}

export const getUserItems = async () => {
    const { data } = await httpClient.get(`${apiUrl}/items/useritems`);
    return data.userItems;
}

export const getUserInterestingItems = async () => {
    const { data } = await httpClient.get(`${apiUrl}/items/userinterestingitems`);
    return data.userInterestingItems;
}

export const getAllInterestedForItem = async (itemId) => {
    const { data } = await httpClient.get(`${apiUrl}/items/allinterestedforitem`, { itemId: itemId });
    return data.interestedForItem;
}


export default {
    addItem,
    addInterestingItems,
    updateItem,
    deleteInterestingItems,
    getCategories,
    getUserItems,
    getUserInterestingItems,
    getAllInterestedForItem,

}