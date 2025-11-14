import axios from "axios";

const isProduction = import.meta.env.MODE === "production";
const apiURL = isProduction
    ? import.meta.env.VITE_API_URL_PRODUCTION
    : import.meta.env.VITE_API_URL_DEVELOPMENT;

const api = axios.create({
    baseURL: apiURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to attach token automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Optional: intercept 401 to log out automatically
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("loggedIn");
            window.location.href = "/Admin_Login";
        }
        return Promise.reject(error);
    }
);

export default api;
