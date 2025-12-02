// src/context/Admin_API_Provider.jsx
import { useState, useCallback } from "react";
import api from "../api"; // Axios instance
import { AdminContext } from "./Admin_API_Context";

// =================== PROVIDER ===================
// Wrap your app with <AdminProvider> to provide admin state & API
export const AdminProvider = ({ children }) => {

  // --------------------------- STATE ---------------------------
    const [admin, setAdmin] = useState(localStorage.getItem("admin_username") || null);
    const [loading, setLoading] = useState(false);

    // Unified cache for all datasets
    const [cache, setCache] = useState({
        topics: null,
        steps: null,
        users: null,
        payments: null,
        allData: null,
    });

  // --------------------------- TOKEN MANAGEMENT ---------------------------
    const getAccessToken = () => localStorage.getItem("admin_access");
    const getRefreshToken = () => localStorage.getItem("admin_refresh");

    // Refresh access token using refresh token
    const refreshToken = async () => {
        const refresh = getRefreshToken();
        if (!refresh) throw new Error("No refresh token available");

        const { data } = await api.post("/api/token/refresh/", { refresh });
        localStorage.setItem("admin_access", data.access);
        return data.access;
    };

  // Attach token to API request headers
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

  // --------------------------- EASY API WRAPPER ---------------------------
    const AdminAPI = {
        get: async (url, config) => {
            try {
                return await api.get(url, attachToken(config));
            } catch (err) {
                // If token expired, refresh and retry
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

        // --------------------------- AUTH ---------------------------
        login: async (username, password) => {
            const { data } = await api.post("/api/admin-login/", { username, password });

            // Store tokens & username
            localStorage.setItem("admin_access", data.access);
            localStorage.setItem("admin_refresh", data.refresh);
            localStorage.setItem("admin_username", data.username);

            setAdmin(data.username);
            return data;
        },

        logout: () => {
            localStorage.removeItem("admin_access");
            localStorage.removeItem("admin_refresh");
            localStorage.removeItem("admin_username");
            setAdmin(null);

            // Clear all cached data
            setCache({ topics: null, steps: null, users: null, payments: null, allData: null });
        },
    };

  // --------------------------- FETCH ALL DATA + CACHE ---------------------------
    const fetchAllData = useCallback(async () => {
        if (cache.allData) return cache.allData; // Return cached data if exists

        setLoading(true);
        try {
            const { data } = await AdminAPI.get("/api/admin/all-data/");

            // Split datasets and store separately for easy access
            setCache({
                allData: data,
                topics: data.topics || [],
                steps: data.steps || [],
                users: data.users || [],
                payments: data.payments || [],
            });

            setLoading(false);
            return data;
        } catch (err) {
            setLoading(false);
            throw err;
        }
    }, [cache.allData]);

  // --------------------------- UPDATE SPECIFIC CACHE LIST ---------------------------
    const updateCacheList = (key, newItem, action = "update") => {
        setCache((prev) => {
            const prevList = prev[key] || [];
            let updated = prevList;

            switch (action) {
                case "add":
                    updated = [...prevList, newItem];
                    break;
                case "update":
                    updated = prevList.map((item) => (item.id === newItem.id ? newItem : item));
                    break;
                case "delete":
                    updated = prevList.filter((item) => item.id !== newItem.id);
                    break;
                default:
                    updated = prevList;
            }

            return { ...prev, [key]: updated };
        });
    };

  // --------------------------- UPDATE OR OVERWRITE CACHE DIRECTLY ---------------------------
    const updateCache = (key, newData) => {
        setCache((prev) => ({ ...prev, [key]: newData }));
    };

  // --------------------------- PROVIDE CONTEXT ---------------------------
    return (
        <AdminContext.Provider
            value={{
                admin,
                loading,
                cache,
                AdminAPI,
                login: AdminAPI.login,
                logout: AdminAPI.logout,
                fetchAllData,
                updateCacheList,
                updateCache,
                refreshToken,
            }}
        >
        {children}
        </AdminContext.Provider>
    );
};
