import React, { createContext, useEffect, useState, useCallback, useContext, useRef } from "react";
import api from "../../../config/api";

export const Parent_API_Provider_Context = createContext();

export const Parent_Api_Provider = ({ children }) => {
    // --- State Management ---
    const [baseData, setBaseData] = useState({ categories: [], sections: [], languages: [] });
    const [loadingBase, setLoadingBase] = useState(true);
    const [errorBase, setErrorBase] = useState(null);
    const [refreshingBase, setRefreshingBase] = useState(false);
    const [recentComponents, setRecentComponents] = useState([]);

    // --- Cache Configuration ---
    const CACHE_KEY = "parent_api_base_data";
    const CACHE_TIME_KEY = "parent_api_base_cache_time";
    const MAX_AGE = 1000 * 60 * 60 * 24 * 3; // 3 days

    const hasInitialized = useRef(false);
    const isFetchingBase = useRef(false);
    const recentFetchedRef = useRef(false);



        // ======================================================
    //      --- Internal Cache Helpers ---
    // ======================================================
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
    // 1. FETCH BASE DATA (Initial load of the entire structure)
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

            // Fetch nested topics for each language
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
    // 2. INCREMENTAL UPDATE (The "Magic" function to avoid refetching)
    // --------------------------------------------------------------------
    /**
     * Call this after a successful POST request to add a topic.
     * It updates the local state and localStorage cache without an API call.
     */
    const addNewTopicLocally = useCallback((languageId, newTopic) => {
        setBaseData((prev) => {
            const updatedLanguages = prev.languages.map((lang) => {
                if (lang.id === languageId) {
                    // Prepend the new topic to the specific language's topic list
                    return {
                        ...lang,
                        topics: [newTopic, ...lang.topics],
                    };
                }
                return lang;
            });

            const newData = { ...prev, languages: updatedLanguages };
            saveToCache(newData); // Sync with localStorage
            return newData;
        });
    }, [saveToCache]);

    // --------------------------------------------------------------------
    // 3. INITIALIZATION LOGIC
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
    // 4. LAZY FETCH FUNCTIONS (Detail/Secondary views)
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

    // --- Backend Steps Caching Logic ---
    const backendStepsCache = useRef({});
    const backendStepsInProgress = useRef({});
    const BACKEND_STEPS_PREFIX = "backend_steps_";
    const BACKEND_STEPS_TIME_PREFIX = "backend_steps_time_";

    const fetchBackendSteps = async (topicId) => {
        if (!topicId) return [];
        if (backendStepsCache.current[topicId]) return backendStepsCache.current[topicId];
        if (backendStepsInProgress.current[topicId]) return backendStepsInProgress.current[topicId];

        try {
            const cached = localStorage.getItem(BACKEND_STEPS_PREFIX + topicId);
            const time = localStorage.getItem(BACKEND_STEPS_TIME_PREFIX + topicId);
            if (cached && time && Date.now() - Number(time) <= MAX_AGE) {
                const data = JSON.parse(cached);
                backendStepsCache.current[topicId] = data;
                return data;
            }
        } catch {}

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

    const fetchBackendImages = async (topicId) => {
        if (!topicId) return [];
        try {
            const res = await api.get("/api/backend-images/", { params: { topic_id: topicId } });
            return res.data;
        } catch (err) {
            return [];
        }
    };

    const fetchTemplateTypes = async () => {
        try {
            const res = await api.get("/api/template-types/");
            return res.data;
        } catch (err) {
            return [];
        }
    };

    const fetchTemplates = async (typeId) => {
        try {
            const res = await api.get("/api/templates/", { params: { type_id: typeId } });
            return res.data;
        } catch (err) {
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
            return [];
        }
    };





    // ============================================================
    //   INSTANTLY UPDATE GLOBAL CACHE ----------->       For Cache Update on Data Add, Update or Delete
    // ============================================================
        const SYNC_VERSION_KEY = "global_sync_version";

        const checkGlobalSync = useCallback(async () => {
            try {
                const res = await api.get("/api/cache-version/");
                const serverVersion = Number(res.data.version); 
                const localVersion = Number(localStorage.getItem(SYNC_VERSION_KEY)) || 0;

                if (serverVersion > localVersion) {
                    console.log("New data detected from backend. Refreshing caches...");

                    // 1. Update version
                    localStorage.setItem(SYNC_VERSION_KEY, serverVersion.toString());

                    // 2. Clear all topic-related caches
                    Object.keys(localStorage).forEach(key => {
                        if (
                            key.startsWith("backend_steps_") ||
                            key.startsWith("backend_steps_time_") ||
                            key.startsWith("frontend_source_") ||
                            key.startsWith("topicCodes_") ||
                            key.startsWith("topicDetail_") ||
                            key.startsWith("backendSteps_") ||
                            key.startsWith("backendImages_") ||
                            key.startsWith("templates_api_data") 
                        ) {
                            localStorage.removeItem(key);
                        }
                    });

                    // 3. Clear in-memory caches
                    backendStepsCache.current = {};
                    backendStepsInProgress.current = {};
                    recentFetchedRef.current = false;

                    // 4. Clear base data cache
                    localStorage.removeItem(CACHE_KEY);
                    localStorage.removeItem(CACHE_TIME_KEY);

                    // 5. Fetch fresh data
                    setRefreshingBase(true);
                    await fetchBaseData(true);
                    await fetchRecentComponents();
                    setRefreshingBase(false);
                }

            } catch (err) {
                console.warn("Global sync check failed:", err);
            }
        }, [fetchBaseData, fetchRecentComponents]);


            // Run this check periodically
        useEffect(() => {
            checkGlobalSync(); // on mount
            const interval = setInterval(checkGlobalSync, 60*1000*60); // every 1minute
            return () => clearInterval(interval);
        }, [checkGlobalSync]);







    // --------------------------------------------------------------------
    // 5. PROVIDER EXPORT
    // --------------------------------------------------------------------
    return (
        <Parent_API_Provider_Context.Provider
            value={{
                // States
                baseData,
                loadingBase,
                errorBase,
                refreshingBase,
                recentComponents,

                // Computed Lists (for easy access)
                categories: baseData?.categories || [],
                sections: baseData?.sections || [],
                languages: baseData?.languages || [],

                // Actions
                fetchTopicDetail,
                fetchFrontendSourceCode,
                fetchBackendSteps,
                fetchBackendImages,
                fetchTemplateTypes,
                fetchTemplates,
                fetchRecentComponents,
                
                // Manual Cache Updates
                addNewTopicLocally, 
            }}
        >
            {children}
        </Parent_API_Provider_Context.Provider>
    );
};

export const useParentAPI = () => useContext(Parent_API_Provider_Context);