import React, { createContext, useEffect, useState, useCallback, useContext, useRef } from "react";
import api from "../config/api";

export const Parent_API_Provider_Context = createContext();

export const Parent_Api_Provider = ({ children }) => {
    const [baseData, setBaseData] = useState({ categories: [], sections: [], languages: [] });
    const [loadingBase, setLoadingBase] = useState(true);
    const [errorBase, setErrorBase] = useState(null);
    const [refreshingBase, setRefreshingBase] = useState(false);
    const [recentComponents, setRecentComponents] = useState([]);

    const CACHE_KEY = "parent_api_base_data";
    const CACHE_TIME_KEY = "parent_api_base_cache_time";
    const MAX_AGE = 1000 * 60 * 60 * 48; // 48 hours

    const hasInitialized = useRef(false);
    const isFetchingBase = useRef(false);
    const recentFetchedRef = useRef(false);

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
  // FETCH BASE DATA (categories, sections, languages + topics)
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
            const shallowCategories = categoriesRes.data.map(c => ({ id: c.id, name: c.name }));
            const shallowSections = sectionsRes.data.map(s => ({ id: s.id, name: s.name, category: s.category }));

            // FETCH TOPICS PER LANGUAGE
            const languagesWithTopics = await Promise.all(
                languagesRes.data.map(async (lang) => {
                    try {
                        const topicsRes = await api.get("/api/topics/", { params: { language_id: lang.id } });
                        const topics = topicsRes.data.map(t => ({
                            id: t.id,
                            name: t.name,
                            created_at: t.created_at,
                            source_codes: t.source_codes?.map(sc => ({
                                id: sc.id,
                                created_at: sc.created_at
                            })) || []
                        }));
                        return { ...lang, topics };
                    } catch {
                        return { ...lang, topics: [] };
                    }
                })
            );
            const combined = {
                categories: shallowCategories,
                sections: shallowSections,
                languages: languagesWithTopics
            };
            setBaseData(combined);
            saveToCache(combined);
        } catch (err) {
            console.error("Base data fetch error:", err);
            setErrorBase(err);
        } finally {
            if (!isBackground) setLoadingBase(false);
            if (isBackground) setRefreshingBase(false);
            isFetchingBase.current = false;
        }
    }, [saveToCache]);

  // --------------------------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------------------------
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const cachedData = loadFromCache();
        if (cachedData) {
            setBaseData(cachedData);
            setLoadingBase(false);

            const time = localStorage.getItem(CACHE_TIME_KEY);
            const expired = !time || Date.now() - Number(time) > MAX_AGE;
            if (expired) {
                setRefreshingBase(true);
                fetchBaseData(true);
            }
        } else {
            fetchBaseData(false);
        }
    }, [fetchBaseData, loadFromCache]);

  // --------------------------------------------------------------------
  // LAZY FETCH FUNCTIONS
  // --------------------------------------------------------------------
    const fetchTopicDetail = async (topicId) => {
        if (!topicId) return null;
        try {
            const res = await api.get(`/api/topics/${topicId}/`);
            return res.data;
        } catch (err) {
            console.error("Topic detail error:", err);
            return null;
        }
    };

    const fetchFrontendSourceCode = async (topicId) => {
        if (!topicId) return [];
        try {
            const res = await api.get("/api/frontend-source-codes/", { params: { topic_id: topicId } });
            return res.data;
        } catch (err) {
            console.error("Frontend source code error:", err);
            return [];
        }
    };

  // ----------------------- BACKEND STEPS CACHING -----------------------
    const backendStepsCache = useRef({});
    const backendStepsInProgress = useRef({});
    const BACKEND_STEPS_PREFIX = "backend_steps_";
    const BACKEND_STEPS_TIME_PREFIX = "backend_steps_time_";

    const fetchBackendSteps = async (topicId) => {
        if (!topicId) return [];

        // Check in-memory cache
        if (backendStepsCache.current[topicId]) return backendStepsCache.current[topicId];
        if (backendStepsInProgress.current[topicId]) return backendStepsInProgress.current[topicId];

        // Check localStorage cache
        try {
            const cached = localStorage.getItem(BACKEND_STEPS_PREFIX + topicId);
            const time = localStorage.getItem(BACKEND_STEPS_TIME_PREFIX + topicId);
            if (cached && time && Date.now() - Number(time) <= MAX_AGE) {
                const data = JSON.parse(cached);
                backendStepsCache.current[topicId] = data;
                return data;
            }
        } catch {}

        // Fetch from API
        const promise = api.get("/api/backend-steps/", { params: { topic_id: topicId } })
            .then(res => {
                backendStepsCache.current[topicId] = res.data;
                try {
                    localStorage.setItem(BACKEND_STEPS_PREFIX + topicId, JSON.stringify(res.data));
                    localStorage.setItem(BACKEND_STEPS_TIME_PREFIX + topicId, Date.now().toString());
                } catch {}
                return res.data;
            })
            .finally(() => delete backendStepsInProgress.current[topicId]);
        backendStepsInProgress.current[topicId] = promise;
        return promise;
    };


// ------------ FETCH BACKEND IMAGES -----------------------
    const fetchBackendImages = async (topicId) => {
        if (!topicId) return [];
        try {
            const res = await api.get("/api/backend-images/", { params: { topic_id: topicId } });
            return res.data;
        } catch (err) {
            console.error("Backend images error:", err);
            return [];
        }
    };


// ------------ FETCH TEMPLATE TYPES -----------------------
    const fetchTemplateTypes = async () => {
        try {
            const res = await api.get("/api/template-types/");
            return res.data;
        } catch (err) {
            console.error("Template types error:", err);
            return [];
        }
    };


// ------------ FETCH TEMPLATES -----------------------
    const fetchTemplates = async (typeId) => {
        try {
            const res = await api.get("/api/templates/", { params: { type_id: typeId } });
            return res.data;
        } catch (err) {
            console.error("Templates error:", err);
            return [];
        }
    };


//------------ RECENT COMPONENTS FETCH ------------
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
                baseData,
                loadingBase,
                errorBase,
                refreshingBase,
                recentComponents,

                categories: baseData?.categories || [],
                sections: baseData?.sections || [],
                languages: baseData?.languages || [],

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

// Hook
export const useParentAPI = () => useContext(Parent_API_Provider_Context);
