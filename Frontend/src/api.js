// src/config/api.js
import axios from "axios";

// Determine environment
const isProduction = import.meta.env.MODE === "production";

// Backend URL from environment variables
const apiURL = isProduction
    ? import.meta.env.VITE_API_URL_PRODUCTION // e.g., "https://codevora-backend.vercel.app"
    : import.meta.env.VITE_API_URL_DEVELOPMENT; // e.g., "http://localhost:8000"

// Create Axios instance
const api = axios.create({
    baseURL: apiURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // important for session cookies (CSRF/session auth)
});

// Request interceptor: attach JWT if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: optional, handle global errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401/403 globally if needed
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn("Unauthorized / Forbidden request", error.response);
        }
        return Promise.reject(error);
    }
);

export default api;
