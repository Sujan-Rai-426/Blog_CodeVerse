// src/template_Pages/Template_API.jsx
import React, { createContext, useEffect, useState } from "react";
import api from "../api"; // axios instance configured with baseURL

export const Templates_API_Context = createContext();

// ---------------------------
// DEMO Templates (fallback)
// ---------------------------
const demoTemplates = [
  {
    id: 1,
    access_type: "Free",
    price: 0,
    title: "React Github Page",
    project_info: "Demo React Github page hosted in GitHub.",
    iframe_url: "https://donkirkby.github.io/react-gh-pages/?utm_source=chatgpt.com",
    download_repo_url: "https://github.com/donkirkby/react-gh-pages/archive/refs/heads/main.zip",
    cover_image: "https://via.placeholder.com/150",
    documentation: "https://github.com/donkirkby/react-gh-pages#readme"
  },
  {
    id: 2,
    access_type: "Free",
    price: 0,
    title: "Portfolio using React TS [ Demo ]",
    project_info: "Demo portfolio created for testing purposes.",
    iframe_url: "https://lwportfolio01.muhilanorg.in/",
    download_repo_url: "https://lightswind.com/templates/portfolio01",
    cover_image: "https://via.placeholder.com/150",
    documentation: "https://lightswind.com/templates/portfolio01"
  }
];

export const Templates_API_Provider = ({ children }) => {
  const [templates, setTemplates] = useState(demoTemplates);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load cached data
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

    const fetchData = async () => {
      try {
        const response = await api.get("/api/templates/");
        if (Array.isArray(response.data)) {
          setTemplates(response.data);
          localStorage.setItem("templates_api_data", JSON.stringify(response.data));
        }
      } catch (err) {
        console.error("API error → using demo templates:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Templates_API_Context.Provider value={{ templates, loading, error }}>
      {children}
    </Templates_API_Context.Provider>
  );
};

// --------------------------------------------------
// Utility functions for manual fetch
// --------------------------------------------------
export const fetchTemplates = async () => {
  try {
    const res = await api.get("/api/templates/");
    if (Array.isArray(res.data)) return res.data;
  } catch {}
  return demoTemplates;
};

export const fetchTemplateById = async (id) => {
  try {
    const res = await api.get(`/api/templates/${id}/`);
    return res.data;
  } catch {
    return demoTemplates.find((t) => t.id === Number(id)) || null;
  }
};
