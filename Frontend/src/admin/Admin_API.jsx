// src/api/Admin_API.jsx
import axios from "axios";

// Dynamic backend URL based on environment
const isProduction = import.meta.env.MODE === "production";
const API_URL = isProduction
  ? import.meta.env.VITE_API_URL_PRODUCTION
  : import.meta.env.VITE_API_URL_DEVELOPMENT;

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // JWT, not cookies
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional global 401/403 handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      console.warn("Unauthorized / Forbidden request", err.response);
    }
    return Promise.reject(err);
  }
);

// ====================
// Exported Functions
// ====================

export const AdminAPI = {
  login: async (username, password) => {
    const res = await api.post("/api/admin-login/", { username, password });
    // Save tokens
    localStorage.setItem("admin_access", res.data.access);
    localStorage.setItem("admin_refresh", res.data.refresh);
    localStorage.setItem("admin_username", res.data.username);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("admin_access");
    localStorage.removeItem("admin_refresh");
    localStorage.removeItem("admin_username");
  },

  fetchAllData: async () => {
    const res = await api.get("/api/admin/all-data/");
    return res.data;
  },

  refreshToken: async () => {
    const refresh = localStorage.getItem("admin_refresh");
    if (!refresh) throw new Error("No refresh token available");

    const res = await api.post("/api/token/refresh/", { refresh });
    localStorage.setItem("admin_access", res.data.access);
    return res.data.access;
  },

  getCurrentAdmin: () => {
    return localStorage.getItem("admin_username") || null;
  },
};

export default AdminAPI;
