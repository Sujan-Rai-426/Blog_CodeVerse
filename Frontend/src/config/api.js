// src/config/api.js
import axios from "axios";

// Determine environment
const isProduction = import.meta.env.MODE === "production";

// Backend URL from .env
const apiURL = isProduction
  ? import.meta.env.VITE_API_URL_PRODUCTION   // https://codevora-backend.vercel.app
  : import.meta.env.VITE_API_URL_DEVELOPMENT; // http://localhost:3000

// Create Axios instance
const api = axios.create({
  baseURL: apiURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // ❌ IMPORTANT: You are using JWT, not cookies → disable this
});

// Attach Bearer token FOR admin automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt-admin-access"); // ✔ your backend returns "access"
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional global 401 handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("Unauthorized / Forbidden request", error.response);
    }
    return Promise.reject(error);
  }
);

export default api;
