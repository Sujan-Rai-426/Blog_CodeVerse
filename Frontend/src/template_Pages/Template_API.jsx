import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import api from "../config/api";

export const Templates_API_Context = createContext();

const CACHE_KEY = "templates_api_data";

export const Templates_API_Provider = ({ children }) => {
  // 🔥 Load cache first
  const [templates, setTemplates] = useState(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isFetching = useRef(false);
  const hasCache = useRef(templates.length > 0);

  // ✅ CACHE-AWARE FETCH
  const fetchTemplates = useCallback(async (force = false) => {
    // ⛔ prevent duplicate or unnecessary fetch
    if (isFetching.current) return;
    if (!force && hasCache.current) return;

    isFetching.current = true;
    setLoading(true);

    try {
      const response = await api.get("/api/templates/");
      if (Array.isArray(response.data)) {
        setTemplates(response.data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(response.data));
        hasCache.current = true;
      }
    } catch (err) {
      console.error("Templates API error:", err);
      setError(err);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, []);

  // ✅ Auto-fetch ONLY if cache empty
  useEffect(() => {
    if (!hasCache.current) {
      fetchTemplates();
    }
  }, [fetchTemplates]);

  const getTemplateById = useCallback(
    (id) => templates.find((t) => t.id === Number(id)) || null,
    [templates]
  );

  return (
    <Templates_API_Context.Provider
      value={{
        templates,
        loading,
        error,
        fetchTemplates,
        getTemplateById,
      }}
    >
      {children}
    </Templates_API_Context.Provider>
  );
};

export const useTemplates = () => useContext(Templates_API_Context);
