import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import Admin_API from "./Admin_API";

const Admin_API_Context = createContext();
export const useAdminAPI = () => useContext(Admin_API_Context);

export const Admin_API_Provider = ({ children }) => {
    const CACHE_KEY = "admin_api_data";
    const CACHE_TIME_KEY = "admin_api_cache_time";
    const MAX_AGE = 1000 * 60 * 60 * 24; // 24h

    const loadFromCache = () => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            const time = localStorage.getItem(CACHE_TIME_KEY);
            if (!cached || !time) return null;
            const isExpired = Date.now() - Number(time) > MAX_AGE;
            return isExpired ? null : JSON.parse(cached);
        } catch {
            return null;
        }
    };

    const saveToCache = (data) => {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    };

    const [adminData, setAdminData] = useState(() => loadFromCache() || {});
    const [loading, setLoading] = useState(!loadFromCache());
    const [error, setError] = useState(null);

    const fetchAdminData = useCallback(async () => {
        const token = localStorage.getItem("admin_token");
        if (!token) return; // skip if not logged in

        setLoading(true);
        try {
            const res = await Admin_API.get("/api/admin/all-data/");
            setAdminData(res.data);
            saveToCache(res.data);
        } catch (err) {
            console.error(err);
            setError(err);
            if (err.response?.status === 401) {
                localStorage.removeItem("admin_token");
                window.location.replace("/Admin_Login");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAdminData();
    }, [fetchAdminData]);

    return (
        <Admin_API_Context.Provider value={{ adminData, loading, error, refetch: fetchAdminData }}>
            {children}
        </Admin_API_Context.Provider>
    );
};
