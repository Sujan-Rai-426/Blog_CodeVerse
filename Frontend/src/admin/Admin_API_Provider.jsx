// src/context/Admin_API_Provider.jsx
import { createContext, useContext, useState } from "react";
import axios from "axios";

// =================== CONTEXT ===================
const AdminContext = createContext();

// ✅ Custom hook to access admin context
export const useAdmin = () => useContext(AdminContext);

// =================== PROVIDER ===================
export const AdminProvider = ({ children }) => {
  // --------------------------- STATE ---------------------------
  const [admin, setAdmin] = useState(localStorage.getItem("admin_username") || null);
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState({});

  // --------------------------- AXIOS INSTANCE ---------------------------
  const API_URL = import.meta.env.VITE_API_URL_DEVELOPMENT; // adjust for production
  const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
  });

  // Attach token automatically
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("admin_access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Optional: global 401/403 handler
  api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        console.warn("Unauthorized / Forbidden request", err.response);
      }
      return Promise.reject(err);
    }
  );

  // --------------------------- ADMINAPI OBJECT ---------------------------
  const AdminAPI = {
    // Axios wrapper methods
    get: (url, config) => api.get(url, config),
    post: (url, data, config) => api.post(url, data, config),
    put: (url, data, config) => api.put(url, data, config),
    delete: (url, config) => api.delete(url, config),

    // Login/logout methods
    login: async (username, password) => {
      const res = await api.post("/api/admin-login/", { username, password });
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
    getCurrentAdmin: () => localStorage.getItem("admin_username") || null,

    // Optional: token refresh
    refreshToken: async () => {
      const refresh = localStorage.getItem("admin_refresh");
      if (!refresh) throw new Error("No refresh token available");
      const res = await api.post("/api/token/refresh/", { refresh });
      localStorage.setItem("admin_access", res.data.access);
      return res.data.access;
    },
  };

  // --------------------------- LOGIN ---------------------------
  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await AdminAPI.login(username, password);
      setAdmin(data.username);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // --------------------------- LOGOUT ---------------------------
  const logout = () => {
    AdminAPI.logout();
    setAdmin(null);
    setCache({});
  };

  // --------------------------- FETCH ALL DATA WITH CACHE ---------------------------
  const fetchAllData = async () => {
    if (cache["allData"]) return cache["allData"];
    setLoading(true);
    try {
      const { data } = await AdminAPI.get("/api/admin/all-data/");
      setCache((prev) => ({ ...prev, allData: data }));
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // --------------------------- UPDATE CACHE ---------------------------
  const updateCache = (key, newData, action = "update") => {
    setCache((prev) => {
      const prevData = prev[key] || [];
      let updatedData;
      switch (action) {
        case "add":
          updatedData = [...prevData, newData];
          break;
        case "update":
          updatedData = prevData.map((item) =>
            item.id === newData.id ? newData : item
          );
          break;
        case "delete":
          updatedData = prevData.filter((item) => item.id !== newData.id);
          break;
        default:
          updatedData = prevData;
      }
      return { ...prev, [key]: updatedData };
    });
  };

  // --------------------------- REFRESH ACCESS TOKEN ---------------------------
  const refreshAccessToken = async () => {
    try {
      return await AdminAPI.refreshToken();
    } catch (err) {
      logout();
      throw err;
    }
  };

  // --------------------------- PROVIDER VALUE ---------------------------
  return (
    <AdminContext.Provider
      value={{
        admin,
        loading,
        cache,
        login,
        logout,
        fetchAllData,
        updateCache,
        refreshAccessToken,
        AdminAPI, // ✅ now has .get, .post, .put, .delete
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
