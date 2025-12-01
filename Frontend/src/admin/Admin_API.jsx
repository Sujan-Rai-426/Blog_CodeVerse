// src/api/Admin_API.jsx
import api from "../api"; // Use the shared axios instance with interceptor

// ==================== ADMIN API FUNCTIONS ====================
const AdminAPI = {
  // -------------------- LOGIN --------------------
  login: async (username, password) => {
    const res = await api.post("/api/admin-login/", { username, password });
    // Save tokens
    localStorage.setItem("admin_access", res.data.access);
    localStorage.setItem("admin_refresh", res.data.refresh);
    localStorage.setItem("admin_username", res.data.username);
    return res.data;
  },

  // -------------------- LOGOUT --------------------
  logout: () => {
    localStorage.removeItem("admin_access");
    localStorage.removeItem("admin_refresh");
    localStorage.removeItem("admin_username");
  },

  // -------------------- FETCH ALL DATA --------------------
  fetchAllData: async () => {
    const res = await api.get("/api/admin/all-data/");
    return res.data;
  },

  // -------------------- REFRESH TOKEN --------------------
  refreshToken: async () => {
    const refresh = localStorage.getItem("admin_refresh");
    if (!refresh) throw new Error("No refresh token available");

    const res = await api.post("/api/token/refresh/", { refresh });
    localStorage.setItem("admin_access", res.data.access);
    return res.data.access;
  },

  // -------------------- GET CURRENT ADMIN --------------------
  getCurrentAdmin: () => {
    return localStorage.getItem("admin_username") || null;
  },

  // -------------------- GENERIC REQUEST METHODS --------------------
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  patch: (url, data, config) => api.patch(url, data, config),
  delete: (url, config) => api.delete(url, config),
};

export default AdminAPI;
