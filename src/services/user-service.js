import httpClient from "./api-client";
import { apiUrl } from "../config/config.json";
import jwtDecode from "jwt-decode";


const tokenKey = "token";

export const signup = async (data) => {
    await httpClient.post(`${apiUrl}/users/adduser`, data);
}

export const signin = async (credentials) => {
    let { data } = await httpClient.post(`${apiUrl}/auth`, credentials);
    localStorage.setItem(tokenKey, data.token);
}

export const logout = async () => {
    await localStorage.removeItem(tokenKey);
}

export const forgotPassword = async (email) => {
    try {
        await httpClient.put(`${apiUrl}/users/forgotpassword`, { email });
    }
    catch (ex) {
        console.log("Failed To Send Forgot Password Email");
    }
}

export const getUserDetails = async () => {
    const { data } = await httpClient.get(`${apiUrl}/users/me`);
    return data;
}

export const getUserById = async (userId) => {
    const { data } = await httpClient.get(`${apiUrl}/users/${userId}`);
    return data;
}


export const updateUser = async (user) => {
    const { data } = await httpClient.put(`${apiUrl}/users/updateuser`, user);
    return data;
}

export const changePassword = async (user) => {
    const { data } = await httpClient.put(`${apiUrl}/users/changepassword`, user);
    return data;
}

export const currentUser = () => {
    try {
        const token = localStorage.getItem(tokenKey);
        return jwtDecode(token);
    }
    catch (ex) {
        return null;
    }
}


export const getToken = () => {
    return localStorage.getItem(tokenKey);
}



export default {
    signup,
    signin,
    currentUser,
    logout,
    forgotPassword,
    getUserDetails,
    getUserById,
    updateUser,
    changePassword,
    getToken,
}
