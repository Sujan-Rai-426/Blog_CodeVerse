import React, { createContext, useEffect, useState } from "react";
import api from "../api";

export const Parent_API_Provider_Context = createContext();

export const Parent_Api_Provider = ({ children }) => {
  const [data, setData] = useState(null); // Full API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load cached data
  const loadFromCache = () => {
    const cached = localStorage.getItem("parent_api_data");
    return cached ? JSON.parse(cached) : null;
  };

  useEffect(() => {
    const cachedData = loadFromCache();
    if (cachedData) {
      setData(cachedData);
      setLoading(false); // Show cached data immediately
    }

    // Fetch fresh data
    const fetchData = async () => {
      try {
        const res = await fetch(`${api}/categories/`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const categories = await res.json();
        setData(categories);
        localStorage.setItem("parent_api_data", JSON.stringify(categories));
      } catch (err) {
        console.error("Parent API fetch error:", err);
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
