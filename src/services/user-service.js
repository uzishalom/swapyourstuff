import httpClient from "./api-client";
import { apiUrl } from "../config/config.json";

import jwtDecode from "jwt-decode";
import Swal from 'sweetalert2'



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

export const showUserDetailsPopup = async (userId) => {
    let user = null;
    try {
        user = await getUserById(userId);
    }
    catch (ex) {
        console.log(ex);
    }

    if (!user) {
        Swal.fire({
            icon: "error",
            title: 'Oops ...',
            html: `<div class="text-left">We are sorry, but we can not show the user details at the moment.</div>`,
            confirmButtonColor: '#f27474'
        });
        return;
    }

    Swal.fire({
        title: '<span class="text-info"><u>User Details</u></span>',
        html: `
        <div class="text-left">
        <div><b>Name: </b>${user.name}</divWe>
        <div><b>Email: </b><a href = "mailto:${user.email}">${user.email}</a> </div>
        <div><b>Phone: </b><a href = "tel:${user.phone}">${user.phone}</a></div>
       <div><b>City: </b> ${user.city}</div>
       </div>
    `,
    })

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
    showUserDetailsPopup,
    getToken,
}
