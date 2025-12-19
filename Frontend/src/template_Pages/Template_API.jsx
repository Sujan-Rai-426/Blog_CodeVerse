import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import api from "../config/api";

export const Templates_API_Context = createContext();

const demoTemplates = [
  { id: 1, access_type: "Free", price: 0, title: "Portfolio website demo", iframe_url: "https://sujan140.vercel.app" },
  { id: 2, access_type: "Free", price: 0, title: "Portfolio using React TS", iframe_url: "https://lwportfolio01.muhilanorg.in/" },
];

export const Templates_API_Provider = ({ children }) => {
  const [templates, setTemplates] = useState(() => {
    const cached = localStorage.getItem("templates_api_data");
    return cached ? JSON.parse(cached) : demoTemplates;
  });

  const [loading, setLoading] = useState(!templates?.length);
  const [error, setError] = useState(null);

  const isFetching = useRef(false);

  // Fetch templates if not already loaded
  const fetchTemplates = useCallback(async () => {
    if (isFetching.current || (templates && templates.length > 0)) return;
    isFetching.current = true;
    setLoading(true);
    try {
      const response = await api.get("/api/templates/");
      if (Array.isArray(response.data) && response.data.length > 0) {
        setTemplates(response.data);
        localStorage.setItem("templates_api_data", JSON.stringify(response.data));
      }
    } catch (err) {
      console.error("Templates API error → using fallback demo templates.", err);
      setError(err);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [templates]);

  // Expose helper to get template by ID
  const getTemplateById = useCallback(
    (id) => {
      return templates?.find((t) => t.id === Number(id)) || null;
    },
    [templates]
  );

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return (
    <Templates_API_Context.Provider value={{ templates, loading, error, fetchTemplates, getTemplateById }}>
      {children}
    </Templates_API_Context.Provider>
  );
};

// Hook for easy usage
export const useTemplates = () => useContext(Templates_API_Context);
