// src/template_Pages/Template_API.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../config/api"; // axios instance

// Context
export const Templates_API_Context = createContext();

// Demo templates (fallback)
const demoTemplates = [
  {
    id: 1,
    access_type: "Free",
    price: 0,
    title: "Portfolio website demo",
    project_info: "Demo React Github page hosted in GitHub.",
    iframe_url: "https://sujan140.vercel.app",
    download_repo_url:
      "https://github.com/Sujan-Rai-426/Portfolio/archive/refs/heads/dev.zip",
    template_type: "Portfolio",
    documentation: "https://github.com/Sujan-Rai-426/Portfolio#readme",
  },
  {
    id: 2,
    access_type: "Free",
    price: 0,
    title: "Portfolio using React TS [ By Lightswind.com ]",
    project_info: "Demo portfolio created for testing purposes.",
    iframe_url: "https://lwportfolio01.muhilanorg.in/",
    download_repo_url: "https://lightswind.com/templates/portfolio01",
    template_type: "AI powered",
    documentation: "https://lightswind.com/templates/portfolio01",
  },
];

// Provider
export const Templates_API_Provider = ({ children }) => {
  const [templates, setTemplates] = useState(demoTemplates);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load from localStorage
  const loadFromCache = () => {
    try {
      const cached = localStorage.getItem("templates_api_data");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const cachedData = loadFromCache();
    if (cachedData) {
      setTemplates(cachedData);
      setLoading(false);
    }

    const fetchTemplates = async () => {
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
      }
    };

    fetchTemplates();
  }, []);

  return (
    <Templates_API_Context.Provider value={{ templates, loading, error }}>
      {children}
    </Templates_API_Context.Provider>
  );
};

// ----------------------------
// Hook for easy usage
// ----------------------------
export const useTemplates = () => {
  return useContext(Templates_API_Context);
};

// ----------------------------
// Helper to fetch single template by ID
// ----------------------------
export const fetchTemplateById = async (id) => {
  const cached = localStorage.getItem("templates_api_data");
  const templates = cached ? JSON.parse(cached) : demoTemplates;
  return templates.find((t) => t.id === Number(id)) || null;
};
