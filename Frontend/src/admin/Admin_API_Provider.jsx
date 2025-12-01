// src/context/Admin_API_Provider.jsx
import { createContext, useContext, useState, useCallback } from "react";
import api from "../api"; // axios instance

// =================== CONTEXT ===================
const AdminContext = createContext();
export const useAdmin = () => useContext(AdminContext);

// =================== PROVIDER ===================
export const AdminProvider = ({ children }) => {
  // --------------------------- STATE ---------------------------
    const [admin, setAdmin] = useState(localStorage.getItem("admin_username") || null);
    const [loading, setLoading] = useState(false);
    const [cache, setCache] = useState({});

    // --------------------------- TOKEN MANAGEMENT ---------------------------
    const getAccessToken = () => localStorage.getItem("admin_access");
    const getRefreshToken = () => localStorage.getItem("admin_refresh");

    const refreshToken = async () => {
        const refresh = getRefreshToken();
        if (!refresh) throw new Error("No refresh token available");
        const res = await api.post("/api/token/refresh/", { refresh });
        localStorage.setItem("admin_access", res.data.access);
        return res.data.access;
    };

    const attachToken = (config = {}) => {
        const token = getAccessToken();
        return {
            ...config,
            headers: {
                ...(config.headers || {}),
                Authorization: token ? `Bearer ${token}` : "",
            },
        };
    };

  // --------------------------- ADMIN API ---------------------------
    const AdminAPI = {
        get: async (url, config) => {
            try {
                return await api.get(url, attachToken(config));
            } catch (err) {
                // If 401, refresh token and retry once
                if (err.response?.status === 401) {
                    const newToken = await refreshToken();
                    return api.get(url, attachToken({ ...config, headers: { Authorization: `Bearer ${newToken}` } }));
                }
                throw err;
            }
        },
        post: async (url, data, config) => api.post(url, data, attachToken(config)),
        put: async (url, data, config) => api.put(url, data, attachToken(config)),
        patch: async (url, data, config) => api.patch(url, data, attachToken(config)),
        delete: async (url, config) => api.delete(url, attachToken(config)),

        login: async (username, password) => {
        const res = await api.post("/api/admin-login/", { username, password });
            localStorage.setItem("admin_access", res.data.access);
            localStorage.setItem("admin_refresh", res.data.refresh);
            localStorage.setItem("admin_username", res.data.username);
            setAdmin(res.data.username);
            return res.data;
        },
        logout: () => {
            localStorage.removeItem("admin_access");
            localStorage.removeItem("admin_refresh");
            localStorage.removeItem("admin_username");
            setAdmin(null);
            setCache({});
        },
        getCurrentAdmin: () => localStorage.getItem("admin_username") || null,
    };

  // --------------------------- FETCH ALL DATA WITH CACHE ---------------------------
    const fetchAllData = useCallback(async () => {
        if (cache.allData) return cache.allData; // ✅ avoid repeated requests
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
    }, [cache.allData]);

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
                    updatedData = prevData.map((item) => (item.id === newData.id ? newData : item));
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

  // --------------------------- PROVIDER VALUE ---------------------------
    return (
        <AdminContext.Provider
            value={{
                admin,
                loading,
                cache,
                login: AdminAPI.login,
                logout: AdminAPI.logout,
                fetchAllData,
                updateCache,
                refreshToken,
                AdminAPI,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};
