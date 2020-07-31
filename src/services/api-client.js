import axios from "axios";

axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("token");
axios.defaults.headers.delete = { "Content-Type": "application/json;charset=utf-8" };

export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    patch: axios.patch,
    delete: axios.delete
}