import React, {
    createContext,
    useEffect,
    useState,
    useCallback,
    useContext,
    useRef,
} from "react";
import api from "../config/api"; // your axios instance

export const Parent_API_Provider_Context = createContext();

export const Parent_Api_Provider = ({ children }) => {
    // --------------------------------------------------------------------
    // STATE
    // --------------------------------------------------------------------
    const [baseData, setBaseData] = useState(null);
    const [loadingBase, setLoadingBase] = useState(true);
    const [errorBase, setErrorBase] = useState(null);
    const [refreshingBase, setRefreshingBase] = useState(false);

    // Recent components
    const [recentComponents, setRecentComponents] = useState([]);
    
    // --------------------------------------------------------------------
    // CACHE CONFIG
    // --------------------------------------------------------------------
    const CACHE_KEY = "parent_api_base_data";
    const CACHE_TIME_KEY = "parent_api_base_cache_time";
    const MAX_AGE = 1000 * 60 * 60 * 48; // 48 hours

    // Singleton guards
    const hasInitialized = useRef(false);
    const isFetchingBase = useRef(false);
    const recentFetchedRef = useRef(false);

    // --------------------------------------------------------------------
    // CACHE HELPERS
    // --------------------------------------------------------------------
    const loadFromCache = useCallback(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            const time = localStorage.getItem(CACHE_TIME_KEY);
            if (!cached || !time) return null;
            const expired = Date.now() - Number(time) > MAX_AGE;
            return expired ? null : JSON.parse(cached);
        } catch {
            return null;
        }
    }, []);

    const saveToCache = useCallback((data) => {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    }, []);

    // --------------------------------------------------------------------
    // FETCH BASE DATA (Categories + Sections + Languages)
    // --------------------------------------------------------------------
    const fetchBaseData = useCallback(async (isBackground = false) => {
        if (isFetchingBase.current) return;
        isFetchingBase.current = true;

        if (!isBackground) setLoadingBase(true);
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
            console.error("Base data fetch error:", err);
        } finally {
            if (!isBackground) setLoadingBase(false);
            if (isBackground) setRefreshingBase(false);
            isFetchingBase.current = false;
        }
    }, [baseData, saveToCache]);

    // --------------------------------------------------------------------
    // INITIAL LOAD (cache first → background refresh if expired)
    // --------------------------------------------------------------------
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const cachedData = loadFromCache();
        if (cachedData) {
            setBaseData(cachedData);
            setLoadingBase(false);

            // Refresh only if expired
            const time = localStorage.getItem(CACHE_TIME_KEY);
            const expired = !time || Date.now() - Number(time) > MAX_AGE;
            if (expired) {
                setRefreshingBase(true);
                fetchBaseData(true);
            }
        } else {
            fetchBaseData(false); // no cache → full fetch
        }
    }, [fetchBaseData, loadFromCache]);

    // --------------------------------------------------------------------
    // LAZY ON-DEMAND API FUNCTIONS
    // --------------------------------------------------------------------
    const fetchTopics = async (filters = {}) => {
        try {
            const res = await api.get("/api/topics/", { params: filters });
            return res.data;
        } catch (err) {
            console.error("Topics fetch error:", err);
            return [];
        }
    };

    const fetchTopicDetail = async (topicId) => {
        try {
            const res = await api.get(`/api/topics/${topicId}/`);
            return res.data;
        } catch (err) {
            console.error("Topic detail error:", err);
            return null;
        }
    };

    const fetchFrontendSourceCode = async (topicId) => {
        try {
            const res = await api.get("/api/frontend-source-codes/", { params: { topic_id: topicId } });
            return res.data;
        } catch (err) {
            console.error("Frontend source code error:", err);
            return [];
        }
    };

// Inside Parent_Api_Provider

// -------------------------- Backend Steps Cache --------------------------
const backendStepsCache = useRef({});
const backendStepsInProgress = useRef({});

const fetchBackendSteps = async (topicId) => {
  if (!topicId) return [];

  // ✅ Return cached result if exists
  if (backendStepsCache.current[topicId]) return backendStepsCache.current[topicId];

  // ✅ Return ongoing request promise if already fetching
  if (backendStepsInProgress.current[topicId]) return backendStepsInProgress.current[topicId];

  // Start new fetch
  const promise = api
    .get("/api/backend-steps/", { params: { topic_id: topicId } })
    .then((res) => {
      backendStepsCache.current[topicId] = res.data; // Cache the result
      return res.data;
    })
    .finally(() => {
      delete backendStepsInProgress.current[topicId];
    });

  backendStepsInProgress.current[topicId] = promise;
  return promise;
};


    const fetchBackendImages = async (topicId) => {
        try {
            const res = await api.get("/api/backend-images/", { params: { topic_id: topicId } });
            return res.data;
        } catch (err) {
            console.error("Backend images error:", err);
            return [];
        }
    };

    const fetchTemplateTypes = async () => {
        try {
            const res = await api.get("/api/template-types/");
            return res.data;
        } catch (err) {
            console.error("Template types error:", err);
            return [];
        }
    };

    const fetchTemplates = async (typeId) => {
        try {
            const res = await api.get("/api/templates/", { params: { type_id: typeId } });
            return res.data;
        } catch (err) {
            console.error("Templates error:", err);
            return [];
        }
    };

    const fetchRecentComponents = async () => {
        if (recentFetchedRef.current) return recentComponents;
        recentFetchedRef.current = true;
        try {
            const res = await api.get("/api/frontend-source-codes/");
            const latest6 = [...res.data].sort((a, b) => b.id - a.id).slice(0, 6);
            setRecentComponents(latest6);
            return latest6;
        } catch (err) {
            console.error("Recent components fetch error:", err);
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
                refreshingBase,
                recentComponents,

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
                fetchRecentComponents,
            }}
        >
            {children}
        </Parent_API_Provider_Context.Provider>
    );
};

// Easy custom hook
export const useParentAPI = () => useContext(Parent_API_Provider_Context);
