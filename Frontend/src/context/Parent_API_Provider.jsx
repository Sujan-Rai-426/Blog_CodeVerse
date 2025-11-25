import React, { createContext, useEffect, useState, useCallback } from "react";
import api from "../api"; // axios instance

export const Parent_API_Provider_Context = createContext();

export const Parent_Api_Provider = ({ children }) => {
    const [data, setData] = useState(() => loadFromCache());  // Load instantly
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --------------- LOCAL STORAGE CACHE HELPERS ----------------
    const CACHE_KEY = "parent_api_data";
    const CACHE_TIME_KEY = "parent_api_cache_time";
    const MAX_AGE = 1000 * 60 * 60 * 24; // 24 hours

    function loadFromCache() {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            const time = localStorage.getItem(CACHE_TIME_KEY);
            if (!cached || !time) return null;

            const isExpired = Date.now() - Number(time) > MAX_AGE;
            return isExpired ? null : JSON.parse(cached);
        } catch {
            return null;
        }
    }

    const saveToCache = (data) => {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    };

    // ------------------- FETCH FROM BACKEND ---------------------
    const fetchData = useCallback(async () => {
        try {
            const response = await api.get("/api/categories/");
            setData(response.data);
            saveToCache(response.data);
        } catch (err) {
            console.error("Parent API fetch error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // --------------------- INITIAL LOAD -------------------------
    useEffect(() => {
        const cached = loadFromCache();

        if (cached) {
            setData(cached);
            setLoading(false);
            fetchData(); // background refresh
        } else {
            fetchData();
        }
    }, [fetchData]);

    return (
        <Parent_API_Provider_Context.Provider value={{ data, loading, error }}>
            {children}
        </Parent_API_Provider_Context.Provider>
    );
};
