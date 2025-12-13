import React, {
    createContext,
    useEffect,
    useState,
    useCallback,
    useContext,
} from "react";
import api from "../config/api"; // <-- your dynamic axios instance

export const Parent_API_Provider_Context = createContext();

export const Parent_Api_Provider = ({ children }) => {
  // --------------------------------------------------------------------
  // STATE
  // --------------------------------------------------------------------
    const [baseData, setBaseData] = useState(null);
    const [loadingBase, setLoadingBase] = useState(true);
    const [errorBase, setErrorBase] = useState(null);
    const [refreshingBase, setRefreshingBase] = useState(false);

  // --------------------------------------------------------------------
  // CACHE CONFIG
  // --------------------------------------------------------------------
    const CACHE_KEY = "parent_api_base_data";
    const CACHE_TIME_KEY = "parent_api_base_cache_time";
    const MAX_AGE = 1000 * 60 * 60 * 48; // 48 hours


  // Load from localStorage instantly
    const loadFromCache = useCallback(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            const time = localStorage.getItem(CACHE_TIME_KEY);
            if (!cached || !time) return null;
            const expired = Date.now() - Number(time) > MAX_AGE;
            // If expired, treat as a cache miss
            return expired ? null : JSON.parse(cached);
        } catch {
            return null;
        }
    }, []);


  // Save fresh cache
    const saveToCache = useCallback((data) => {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    }, []);


  // --------------------------------------------------------------------
  // 1️⃣ FETCH BASE DATA (Categories + Sections + Languages)
  // --------------------------------------------------------------------
    const fetchBaseData = useCallback(async (isBackground = false) => {
        if (!isBackground) {
            setLoadingBase(true);
        }
        setErrorBase(null);
        try {
            const [categoriesRes, sectionsRes, languagesRes] = await Promise.all([
                api.get("/api/categories/"),
                api.get("/api/sections/"),
                api.get("/api/languages/"),
            ]);
            const combined = {
                categories: categoriesRes.data,
                sections: sectionsRes.data,
                languages: languagesRes.data,
            };
            setBaseData(combined);
            saveToCache(combined);
        } catch (err) {
            if (!baseData) setErrorBase(err);
        } finally {
            if (!isBackground) {
                setLoadingBase(false);
            }
        }
    }, [baseData, saveToCache]);



  // --------------------------------------------------------------------
  // INITIAL LOAD (cache first → background refresh)
  // --------------------------------------------------------------------
    useEffect(() => {
        const cachedData = loadFromCache();
        if (cachedData) {
            setBaseData(cachedData);
            setLoadingBase(false);
            // ✅ background refresh (NO skeleton)
            setRefreshingBase(true);
            fetchBaseData(true).finally(() => setRefreshingBase(false));
        } else {
            fetchBaseData(false);
        }
    }, []);



  // --------------------------------------------------------------------
  // 2️⃣ LAZY ON-DEMAND API FUNCTIONS
  // --------------------------------------------------------------------

  // Fetch all topics (filters optional)
    const fetchTopics = async (filters = {}) => {
        try {
            const res = await api.get("/api/topics/", { params: filters });
            return res.data;
        } catch (err) {
            console.error("Topics fetch error:", err);
            return [];
        }
    };

  // Single topic detail
    const fetchTopicDetail = async (topicId) => {
        try {
            const res = await api.get(`/api/topics/${topicId}/`);
            return res.data;
        } catch (err) {
            console.error("Topic detail error:", err);
            return null;
        }
    };

  // Frontend source code by topic
    const fetchFrontendSourceCode = async (topicId) => {
        try {
            const res = await api.get("/api/frontend-source-codes/", {
                params: { topic_id: topicId },
            });
            return res.data;
        } catch (err) {
            console.error("Frontend source code error:", err);
            return [];
        }
    };

  // Backend steps by topic
    const fetchBackendSteps = async (topicId) => {
        try {
            const res = await api.get("/api/backend-steps/", {
                params: { topic_id: topicId },
            });
            return res.data;
        } catch (err) {
            console.error("Backend steps error:", err);
            return [];
        }
    };

  // Backend images by topic
    const fetchBackendImages = async (topicId) => {
        try {
            const res = await api.get("/api/backend-images/", {
                params: { topic_id: topicId },
            });
            return res.data;
        } catch (err) {
            console.error("Backend images error:", err);
            return [];
        }
    };

  // All template types
    const fetchTemplateTypes = async () => {
        try {
            const res = await api.get("/api/template-types/");
            return res.data;
        } catch (err) {
            console.error("Template types error:", err);
            return [];
        }
    };

  // Templates for a specific type
    const fetchTemplates = async (typeId) => {
        try {
            const res = await api.get("/api/templates/", {
                params: { type_id: typeId },
            });
            return res.data;
        } catch (err) {
            console.error("Templates error:", err);
            return [];
        }
    };

  // --------------------------------------------------------------------
  // PROVIDER EXPORT
  // --------------------------------------------------------------------
    return (
        <Parent_API_Provider_Context.Provider
            value={{
                // Base cached data
                baseData,
                loadingBase,
                errorBase,

                categories: baseData?.categories || [],
                sections: baseData?.sections || [],
                languages: baseData?.languages || [],

                // Lazy endpoints
                fetchTopics,
                fetchTopicDetail,
                fetchFrontendSourceCode,
                fetchBackendSteps,
                fetchBackendImages,
                fetchTemplateTypes,
                fetchTemplates,
            }}
        >
            {children}
        </Parent_API_Provider_Context.Provider>
    );
};

// Easy custom hook
export const useParentAPI = () => useContext(Parent_API_Provider_Context);
