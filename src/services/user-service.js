import jwtDecode from "jwt-decode"

import httpClient from "./api-client";
import { apiUrl } from "../config/config.json"

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

export const currentUser = () => {
    try {
        const token = localStorage.getItem(tokenKey);
        return jwtDecode(token);
    }
    catch (ex) {
        return null;
    }
}


export default {
    signup,
    signin,
    currentUser,
    logout,
}
