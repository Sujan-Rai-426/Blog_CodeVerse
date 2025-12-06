// src/api/AdminAPI.js
import apiAdmin from "../config/apiAdmin"; // Axios instance with withCredentials: true

// Note: This file assumes your backend API is mounted under `/api/`.
// If your Django urls are mounted elsewhere, update the endpoint strings below.

const AdminAPI = {
  // -------------------- LOGIN --------------------
  // returns backend response data
  login: async (email, password) => {
    const res = await apiAdmin.post("/api/admin-login/", { email, password });
    return res.data;
  },

  // -------------------- LOGOUT --------------------
  logout: async () => {
    const res = await apiAdmin.post("/api/admin-logout/");
    return res.data;
  },

  // -------------------- FETCH ALL DATA --------------------
  fetchAllData: async () => {
    const res = await apiAdmin.get("/api/admin/all-data/");
    return res.data;
  },

  // -------------------- GET CURRENT ADMIN / PROFILE --------------------
  getCurrentAdmin: async () => {
    // Backend should return current user/profile details
    const res = await apiAdmin.get("/api/admin-profile/");
    return res.data;
  },

  // -------------------- GENERIC REQUEST METHODS --------------------
  get: (url, config) => apiAdmin.get(url, config).then(r => r.data),
  post: (url, data, config) => apiAdmin.post(url, data, config).then(r => r.data),
  put: (url, data, config) => apiAdmin.put(url, data, config).then(r => r.data),
  patch: (url, data, config) => apiAdmin.patch(url, data, config).then(r => r.data),
  delete: (url, config) => apiAdmin.delete(url, config).then(r => r.data),
};

export default AdminAPI;
