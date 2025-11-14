import React, { createContext, useEffect, useState } from "react";
import api from "../api";

export const Parent_API_Provider_Context = createContext();

export const Parent_Api_Provider = ({ children }) => {
    const [data, setData] = useState(null); // Full data from API
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load from localStorage cachememory if available
    const loadFromCache = () => {
        const cached = localStorage.getItem("parent_api_data");
        return cached ? JSON.parse(cached) : null;
    };

    useEffect(() => {
        const cachedData = loadFromCache();
        if (cachedData) {
            setData(cachedData);
            setLoading(false);
        }

        const fetchData = async () => {
            try {
                const res = await fetch(`${api}/categories/`);
                const categories = await res.json();

                // Save full data in cache
                localStorage.setItem("parent_api_data", JSON.stringify(categories));
                setData(categories);
            } catch (err) {
                console.error("Error fetching parent API:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Parent_API_Provider_Context.Provider value={{ data, loading, error }}>
            {children}
        </Parent_API_Provider_Context.Provider>
    );
};
