import React, {
                useState,
                useCallback,
                useEffect,
                useRef,
                useMemo,
            } from "react";
import apiAdmin from "../config/apiAdmin";
import { AdminAPI } from "./Admin_Imports";
import { AdminContext } from "./Admin_API_Context";

const DEFAULT_STALE_TIME = 1000 * 60 * 2; // 2 minutes

export const AdminProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loadingInitial, setLoadingInitial] = useState(false);

    // main in-memory cache
    const [cache, setCache] = useState({});
    const cacheRef = useRef({});

    useEffect(() => {
        cacheRef.current = cache;
    }, [cache]);

    const inflight = useRef({});

    // CSRF state
    const [csrfReady, setCsrfReady] = useState(false);
    const [csrfFetching, setCsrfFetching] = useState(false);

  // ---------------------- NEW: Cache Sync Trigger ----------------------
    /**
     * Notifies the backend that data has changed.
     * This updates the global timestamp so Parent users know to clear LocalStorage.
     */
    const bumpServerVersion = useCallback(async () => {
        try {
        // Ensure your Django urls.py has this path registered
            await apiAdmin.post("/api/bump-cache/");
        } catch (e) {
            console.warn("Sync: Failed to update global cache version on server.");
        }
    }, []);

  // ---------------------- CSRF ----------------------
    useEffect(() => {
        (async () => {
            try {
                setCsrfFetching(true);
                await apiAdmin.get("/api/csrf/");
                setCsrfReady(true);
            } catch (err) {
                setCsrfReady(false);
                console.warn("Failed to fetch CSRF on mount:", err?.message || err);
            } finally {
                setCsrfFetching(false);
            }
        })();
    }, []);

    const ensureCsrf = useCallback(async () => {
        if (csrfReady) return;
        if (csrfFetching) {
            for (let i = 0; i < 10; i++) {
                if (csrfReady) return;
                await new Promise((r) => setTimeout(r, 150));
            }
        }
        try {
            setCsrfFetching(true);
            await apiAdmin.get("/api/csrf/");
            setCsrfReady(true);
        } catch (err) {
            setCsrfReady(false);
            throw err;
        } finally {
            setCsrfFetching(false);
        }
    }, [csrfReady, csrfFetching]);


  // ---------------------- Cache helpers ----------------------
    const ensureResourceEntry = useCallback((resource) => {
        setCache((prev) => {
            if (prev[resource]) return prev;
            return {
                ...prev,
                [resource]: { data: null, lastFetched: 0, loading: false, error: null },
            };
        });
    }, []);


    const setResourceState = useCallback((resource, patch) => {
        setCache((prev) => {
            const old = prev[resource] || { data: null, lastFetched: 0, loading: false, error: null };
            return {
                ...prev,
                [resource]: { ...old, ...patch },
            };
        });
    }, []);


    const replaceResourceData = useCallback((resource, newData) => {
        setResourceState(resource, { data: newData, lastFetched: Date.now(), loading: false, error: null });
    }, [setResourceState]);


    const _fetchResourceNetwork = useCallback(async (resource, opts = {}) => {
        const { params = undefined } = opts;
        ensureResourceEntry(resource);
        if (inflight.current[resource]) return inflight.current[resource];
        const url = `/api/${resource}/`;
        setResourceState(resource, { loading: true, error: null });
        const p = (async () => {
            try {
                const data = await AdminAPI.get(url, { params });
                replaceResourceData(resource, data);
                return data;
            } catch (err) {
                setResourceState(resource, { loading: false, error: err });
                throw err;
            } finally {
                delete inflight.current[resource];
            }
        })();
        inflight.current[resource] = p;
        return p;
    }, [replaceResourceData, setResourceState, ensureResourceEntry]);


  // ---------------------- Fetching ----------------------
    const fetchResource = useCallback(
        async (resource, opts = {}) => {
            const { force = false, background = true, params = undefined, staleTime = DEFAULT_STALE_TIME } = opts;
            ensureResourceEntry(resource);
            const entry = cacheRef.current[resource];

            if (!force && entry && entry.data !== null && Date.now() - entry.lastFetched < staleTime) {
                if (background) _fetchResourceNetwork(resource, { params }).catch(() => {});
                return entry.data;
            }

            if (!force && entry && entry.data !== null && background) {
                _fetchResourceNetwork(resource, { params }).catch(() => {});
                return entry.data;
            }

            let data;
            try {
                data = await _fetchResourceNetwork(resource, { params });
            } catch (err) {
                console.error(`Failed to fetch resource ${resource}:`, err);
                data = null;
            }
            return data;
        },
        [ensureResourceEntry, _fetchResourceNetwork]
    );


    const fetchNested = useCallback(async (parentResource, parentId, nestedPath) => {
        const nestedName = `${parentResource}_${parentId}_${Array.isArray(nestedPath) ? nestedPath.join("_") : nestedPath}`;
        ensureResourceEntry(nestedName);
        const path = Array.isArray(nestedPath) ? nestedPath.join("/") : nestedPath;
        const url = `/api/${parentResource}/${parentId}/${path}/`;

        if (inflight.current[nestedName]) return inflight.current[nestedName];

        setResourceState(nestedName, { loading: true, error: null });
        const p = (async () => {
            try {
                const data = await AdminAPI.get(url);
                replaceResourceData(nestedName, data);
                return data;
            } catch (err) {
                setResourceState(nestedName, { loading: false, error: err });
                throw err;
            } finally {
                delete inflight.current[nestedName];
            }
        })();

        inflight.current[nestedName] = p;
        return p;
    }, [ensureResourceEntry, replaceResourceData, setResourceState]);


    const forceRefreshResource = useCallback(async (resource, params) => {
        return _fetchResourceNetwork(resource, { params });
    }, [_fetchResourceNetwork]);



  // ---------------------- UPDATED MUTATIONS ----------------------
    const createResource = useCallback(
        async (resource, payload, opts = {}) => {
            const { optimisticIdKey = null, refresh = false, onSuccess, onError } = opts;
            await ensureCsrf();

                setCache((prev) => {
                    const prevList = prev[resource]?.data || null;
                    if (Array.isArray(prevList)) {
                        const optimisticItem = { ...payload };
                        return {
                            ...prev,
                            [resource]: { ...prev[resource], data: [...prevList, optimisticItem] },
                        };
                    }
                    return prev;
                });
            try {
                const created = await AdminAPI.post(`/api/${resource}/`, payload);
                
                // --- NEW: Trigger Global Sync ---
                await bumpServerVersion();

                setCache((prev) => {
                    const prevList = prev[resource]?.data || null;
                    if (Array.isArray(prevList)) {
                        const filtered = created.id ? prevList.filter((it) => it.id !== created.id) : prevList;
                        return {
                            ...prev,
                            [resource]: { ...prev[resource], data: [...filtered, created], lastFetched: Date.now() },
                        };
                    }
                    return { ...prev, [resource]: { data: [created], lastFetched: Date.now(), loading: false, error: null } };
                });

                onSuccess && onSuccess(created);
                if (refresh) await forceRefreshResource(resource);
                return created;
            } catch (err) {
                try { await forceRefreshResource(resource); } catch (_) {}
                onError && onError(err);
                throw err;
            }
        },
        [ensureCsrf, forceRefreshResource, bumpServerVersion]
    );


    const updateResource = useCallback(
        async (resource, id, payload, opts = {}) => {
            const { refresh = false, onSuccess, onError } = opts;
            await ensureCsrf();

            setCache((prev) => {
                const prevList = prev[resource]?.data || null;
                if (Array.isArray(prevList)) {
                    return {
                        ...prev,
                        [resource]: {
                            ...prev[resource],
                            data: prevList.map((it) => (it.id === id ? { ...it, ...payload } : it)),
                        },
                    };
                }
                return prev;
            });

            try {
                const updated = await AdminAPI.patch(`/api/${resource}/${id}/`, payload);
                
                // --- NEW: Trigger Global Sync ---
                await bumpServerVersion();

                setCache((prev) => {
                    const prevList = prev[resource]?.data || null;
                    if (Array.isArray(prevList)) {
                        return {
                            ...prev,
                            [resource]: {
                                ...prev[resource],
                                data: prevList.map((it) => (it.id === updated.id ? updated : it)),
                                lastFetched: Date.now(),
                            },
                        };
                    }
                    return prev;
                });
                onSuccess && onSuccess(updated);
                if (refresh) await forceRefreshResource(resource);
                return updated;
            } catch (err) {
                try { await forceRefreshResource(resource); } catch (_) {}
                onError && onError(err);
                throw err;
            }
        },
        [ensureCsrf, forceRefreshResource, bumpServerVersion]
    );



    const deleteResource = useCallback(
        async (resource, id, opts = {}) => {
            const { refresh = false, onSuccess, onError } = opts;
            await ensureCsrf();

            let removedItem = null;
            setCache((prev) => {
                const prevList = prev[resource]?.data || null;
                if (Array.isArray(prevList)) {
                    const filtered = prevList.filter((it) => {
                        if (it.id === id) { removedItem = it; return false; }
                        return true;
                    });
                    return { ...prev, [resource]: { ...prev[resource], data: filtered } };
                }
                return prev;
            });

            try {
                await AdminAPI.delete(`/api/${resource}/${id}/`);
                
                // --- NEW: Trigger Global Sync ---
                await bumpServerVersion();

                onSuccess && onSuccess();
                if (refresh) await forceRefreshResource(resource);
                return true;
            } catch (err) {
                setCache((prev) => {
                    const prevList = prev[resource]?.data || null;
                    if (Array.isArray(prevList) && removedItem) {
                        return { ...prev, [resource]: { ...prev[resource], data: [...prevList, removedItem] } };
                    }
                    return prev;
                });
                try { await forceRefreshResource(resource); } catch (_) {}
                onError && onError(err);
                throw err;
            }
        },
        [ensureCsrf, forceRefreshResource, bumpServerVersion]
    );



  // ---------------------- Utilities ----------------------
    const getCached = useCallback((resource) => {
        return cache[resource] || { data: null, lastFetched: 0, loading: false, error: null };
    }, [cache]);


    const updateCacheList = useCallback((resource, item, action = "update") => {
        setCache((prev) => {
            const prevResource = prev[resource] || { data: [], lastFetched: 0, loading: false, error: null };
            let newList = [...(prevResource.data || [])];

            if (action === "update") newList = newList.map((i) => (i.id === item.id ? { ...i, ...item } : i));
            else if (action === "delete") newList = newList.filter((i) => i.id !== item.id);
            else if (action === "add") newList.push(item);
            else if (action === "set") newList = Array.isArray(item) ? item : [];

            return {
                ...prev,
                [resource]: { ...prevResource, data: newList, lastFetched: Date.now() },
            };
        });
    }, []);


    const login = useCallback(async (email, password) => {
        await ensureCsrf();
        const data = await AdminAPI.login(email, password);
        if (data && data.user) setAdmin(data.user);
        else {
            try { setAdmin(await AdminAPI.get("/api/admin-profile/")); }
            catch (e) { setAdmin({ email }); }
        }
        return data;
    }, [ensureCsrf]);


    const logout = useCallback(async () => {
        await ensureCsrf();
        await AdminAPI.logout();
        setAdmin(null);
        setCache({});
    }, [ensureCsrf]);


    const getCurrentAdmin = useCallback(async () => {
        await ensureCsrf();
        const profile = await AdminAPI.get("/api/admin-profile/");
        setAdmin(profile);
        return profile;
    }, [ensureCsrf]);


    const prefetchResources = useCallback(async (resources = []) => {
        setLoadingInitial(true);
        try {
            await Promise.all(resources.map((r) => fetchResource(r, { force: false, background: false })));
        } finally {
            setLoadingInitial(false);
        }
    }, [fetchResource]);



    const exposed = useMemo(() => ({
        admin, setAdmin, loadingInitial,
        cache, getCached, updateCacheList,
        fetchResource, fetchNested, forceRefreshResource,
        createResource, updateResource, deleteResource,
        login, logout, getCurrentAdmin,
        prefetchResources,
        rawGet: AdminAPI.get, rawPost: AdminAPI.post, rawPatch: AdminAPI.patch, rawDelete: AdminAPI.delete,
    }), [
        admin, loadingInitial, cache, getCached, updateCacheList,
        fetchResource, fetchNested, forceRefreshResource,
        createResource, updateResource, deleteResource,
        login, logout, getCurrentAdmin, prefetchResources,
    ]);

    return (
        <AdminContext.Provider value={exposed}>
            {children}
        </AdminContext.Provider>
    );
};