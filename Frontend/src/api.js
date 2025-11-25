import axios from "axios";

const isProduction = import.meta.env.MODE === "production";
const apiURL = isProduction
    ? import.meta.env.VITE_API_URL_PRODUCTION
    : import.meta.env.VITE_API_URL_DEVELOPMENT;

const api = axios.create({
    baseURL: apiURL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // important for cookies
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
