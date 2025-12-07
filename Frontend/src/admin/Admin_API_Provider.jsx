import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import AdminAPI from "./Admin_API";
import apiAdmin from "../config/apiAdmin";
import { AdminContext } from "./Admin_API_Context";

const DEFAULT_STALE_TIME = 1000 * 60 * 2; // 2 minutes stale time by default

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(false);

  // main in-memory cache
  const [cache, setCache] = useState({});
  const cacheRef = useRef({}); // <-- FIX 1: Ref to hold the current cache state

  // Update the cacheRef every time the cache state changes
  useEffect(() => {
    cacheRef.current = cache;
  }, [cache]); // <-- FIX 2: Keep the ref synced with state

  // simple ref to hold inflight fetch promises per resource to avoid duplicate requests
  const inflight = useRef({});

  // CSRF state
  const [csrfReady, setCsrfReady] = useState(false);
  const [csrfFetching, setCsrfFetching] = useState(false);

  // ---------------------- CSRF ----------------------
  // ... (CSRF useEffect and ensureCsrf functions remain the same) ...
  useEffect(() => {
    // fetch CSRF cookie on mount (non-blocking)
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
      // wait for short loop for existing in-flight
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
  // ... (ensureResourceEntry, setResourceState, replaceResourceData remain the same) ...
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

  // helper to merge/replace lists
  const replaceResourceData = useCallback((resource, newData) => {
    setResourceState(resource, { data: newData, lastFetched: Date.now(), loading: false, error: null });
  }, [setResourceState]);


  // internal network fetch with deduplication using inflight ref
  const _fetchResourceNetwork = useCallback(async (resource, opts = {}) => {
    const { params = undefined, background = false } = opts;
    ensureResourceEntry(resource);

    // dedupe: return existing inflight promise if available
    if (inflight.current[resource]) {
      return inflight.current[resource];
    }

    // build url - default expects standard collection endpoint at /api/<resource>/
    const url = `/api/${resource}/`;
    setResourceState(resource, { loading: true, error: null });

    const p = (async () => {
      try {
        const data = await AdminAPI.get(url, { params });
        // if server returns an object with results (paginated), leave as-is; user can specify how to handle
        replaceResourceData(resource, data);
        return data;
      } catch (err) {
        setResourceState(resource, { loading: false, error: err });
        throw err;
      } finally {
        // clear inflight
        delete inflight.current[resource];
      }
    })();

    inflight.current[resource] = p;
    return p;
  }, [replaceResourceData, setResourceState, ensureResourceEntry]);


  // ---------------------- Generic fetch for a top-level resource ----------------------
  const fetchResource = useCallback(
    async (resource, opts = {}) => {
      const { force = false, background = true, params = undefined, staleTime = DEFAULT_STALE_TIME } = opts;
      ensureResourceEntry(resource);

      // current cached entry - FIX: Use cacheRef.current
      const entry = cacheRef.current[resource];

      // if not forced and we have data and not stale -> return cache
      if (!force && entry && entry.data !== null && Date.now() - entry.lastFetched < staleTime) {
        // optionally do background refresh if requested
        if (background) {
          // trigger background fetch but don't await
          _fetchResourceNetwork(resource, { params, background: true }).catch(() => {});
        }
        return entry.data;
      }

      // if data exists but stale and background true -> return cached and refresh in background
      if (!force && entry && entry.data !== null && background) {
        _fetchResourceNetwork(resource, { params, background: true }).catch(() => {});
        return entry.data;
      }

      // else fetch from network and return fresh
      let data;
        try {
            data = await _fetchResourceNetwork(resource, { params, background: false });
        } catch (err) {
            console.error(`Failed to fetch resource ${resource}:`, err);
            data = null; // fallback
        }
      return data;
    },
    // FIX: Dependency array no longer includes 'cache', 
    // it is now stable and only depends on helper functions.
    [ensureResourceEntry, _fetchResourceNetwork] 
  );


  // ---------------------- Fetch nested endpoints --------------------------------
  // ... (fetchNested remains the same, but now depends on the stable fetchResource and helpers) ...
  const fetchNested = useCallback(async (parentResource, parentId, nestedPath, opts = {}) => {
    const nestedName = `${parentResource}_${parentId}_${Array.isArray(nestedPath) ? nestedPath.join("_") : nestedPath}`;
    ensureResourceEntry(nestedName);

    // Build the URL: /api/{parentResource}/{parentId}/{nestedPath}/
    const path = Array.isArray(nestedPath) ? nestedPath.join("/") : nestedPath;
    const url = `/api/${parentResource}/${parentId}/${path}/`;

    // dedupe similar to fetchResource
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

  // ---------------------- Forces a refresh (bypasses cache) ----------------------
  const forceRefreshResource = useCallback(async (resource, params) => {
    return _fetchResourceNetwork(resource, { params, background: false });
  }, [_fetchResourceNetwork]);

  // ---------------------- Mutations (create / update / delete) ----------------------
  // ... (createResource, updateResource, deleteResource remain the same) ...
  const createResource = useCallback(
    async (resource, payload, opts = {}) => {
      // opts: { optimisticIdKey, refresh: true/false, onSuccess, onError }
      const { optimisticIdKey = null, refresh = false, onSuccess, onError } = opts;

      await ensureCsrf();

      // optimistic update: append to cached list if it exists
      setCache((prev) => {
        const prevList = prev[resource]?.data || null;
        if (Array.isArray(prevList)) {
          // if server returns actual created object later, we'll replace it
          const optimisticItem = optimisticIdKey ? { ...payload } : { ...payload };
          return {
            ...prev,
            [resource]: {
              ...prev[resource],
              data: [...prevList, optimisticItem],
            },
          };
        }
        return prev;
      });

      try {
        const created = await AdminAPI.post(`/api/${resource}/`, payload);
        // update cache: replace item if it matches by id; otherwise append
        setCache((prev) => {
          const prevList = prev[resource]?.data || null;
          if (Array.isArray(prevList)) {
            // if created has id, try replace optimistic placeholder by id or by shallow match
            if (created && created.id) {
              const filtered = prevList.filter((it) => it.id !== created.id);
              return {
                ...prev,
                [resource]: { ...prev[resource], data: [...filtered, created], lastFetched: Date.now() },
              };
            }
            // fallback: append
            return {
              ...prev,
              [resource]: { ...prev[resource], data: [...prevList, created], lastFetched: Date.now() },
            };
          }
          // if no list cached, set new list
          return {
            ...prev,
            [resource]: { data: [created], lastFetched: Date.now(), loading: false, error: null },
          };
        });
        onSuccess && onSuccess(created);
        // optional server-side refresh
        if (refresh) await forceRefreshResource(resource);
        return created;
      } catch (err) {
        // on failure, fallback: re-fetch the resource to reconcile
        try {
          await forceRefreshResource(resource);
        } catch (_) {}
        onError && onError(err);
        throw err;
      }
    },
    [ensureCsrf, forceRefreshResource]
  );

  const updateResource = useCallback(
    async (resource, id, payload, opts = {}) => {
      const { refresh = false, onSuccess, onError } = opts;
      await ensureCsrf();

      // optimistic update: update item in cache
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
        // replace in cache
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
        // rollback by refetching
        try {
          await forceRefreshResource(resource);
        } catch (_) {}
        onError && onError(err);
        throw err;
      }
    },
    [ensureCsrf, forceRefreshResource]
  );

  const deleteResource = useCallback(
    async (resource, id, opts = {}) => {
      const { refresh = false, onSuccess, onError } = opts;
      await ensureCsrf();

      // optimistic remove
      let removedItem = null;
      setCache((prev) => {
        const prevList = prev[resource]?.data || null;
        if (Array.isArray(prevList)) {
          const filtered = prevList.filter((it) => {
            if (it.id === id) {
              removedItem = it;
              return false;
            }
            return true;
          });
          return { ...prev, [resource]: { ...prev[resource], data: filtered } };
        }
        return prev;
      });

      try {
        await AdminAPI.delete(`/api/${resource}/${id}/`);
        onSuccess && onSuccess();
        if (refresh) await forceRefreshResource(resource);
        return true;
      } catch (err) {
        // rollback by re-adding removed item or re-fetching
        setCache((prev) => {
          const prevList = prev[resource]?.data || null;
          if (Array.isArray(prevList) && removedItem) {
            return { ...prev, [resource]: { ...prev[resource], data: [...prevList, removedItem] } };
          }
          return prev;
        });
        try {
          await forceRefreshResource(resource);
        } catch (_) {}
        onError && onError(err);
        throw err;
      }
    },
    [ensureCsrf, forceRefreshResource]
  );


  // ---------------------- Helper: get cached entry (fast sync) ----------------------
  const getCached = useCallback((resource) => {
    return cache[resource] || { data: null, lastFetched: 0, loading: false, error: null };
  }, [cache]);


  // ---------------------- Helper: Update Cach list when data is updated ----------------------
  const updateCacheList = useCallback((resource, item, action = "update") => {
      setCache((prev) => {
          const prevResource = prev[resource] || { data: [], lastFetched: 0, loading: false, error: null };
          let prevList = prevResource.data || [];
          let newList = [...prevList];

          if (action === "update") {
              newList = newList.map((i) => (i.id === item.id ? { ...i, ...item } : i));
          } else if (action === "delete") {
              newList = newList.filter((i) => i.id !== item.id);
          } else if (action === "add") {
              newList.push(item);
          } else if (action === "set") {
              newList = Array.isArray(item) ? item : [];
          }

          return {
              ...prev,
              [resource]: {
                  ...prevResource,
                  data: newList,
                  lastFetched: Date.now(),
              },
          };
      });
  }, []);




  // ---------------------- Admin login/logout helpers ----------------------
  // ... (login, logout, getCurrentAdmin, prefetchResources remain the same) ...
  const login = useCallback(
    async (email, password) => {
      await ensureCsrf();
      const data = await AdminAPI.login(email, password);
      // try fetch profile if not included
      if (data && data.user) {
        setAdmin(data.user);
      } else {
        try {
          const profile = await AdminAPI.get("/api/admin-profile/");
          setAdmin(profile);
        } catch (e) {
          setAdmin({ email });
        }
      }
      return data;
    },
    [ensureCsrf]
  );



  const logout = useCallback(async () => {
    await ensureCsrf();
    await AdminAPI.logout();
    setAdmin(null);
    // clear cache on logout
    setCache({});
  }, [ensureCsrf]);



  const getCurrentAdmin = useCallback(async () => {
    await ensureCsrf();
    const profile = await AdminAPI.get("/api/admin-profile/");
    setAdmin(profile);
    return profile;
  }, [ensureCsrf]);



  // optional utility: prefetch multiple resources in parallel (e.g., when admin opens dashboard)
  const prefetchResources = useCallback(async (resources = []) => {
    setLoadingInitial(true);
    try {
      await Promise.all(resources.map((r) => fetchResource(r, { force: false, background: false })));
    } finally {
      setLoadingInitial(false);
    }
  }, [fetchResource]);



  // ---------------------- Exposed API to consumers ----------------------
  const exposed = useMemo(() => ({
    // state
    admin,
    setAdmin,
    loadingInitial,

    // cache
    cache,
    getCached, // quick access
    updateCacheList,

    // resources
    fetchResource,      // fetch collection (smart: returns cached immediately if valid)
    fetchNested,        // fetch nested path like /api/parent/{id}/child/
    forceRefreshResource, // bypass cache and refresh

    // mutations
    createResource,
    updateResource,
    deleteResource,

    // auth
    login,
    logout,
    getCurrentAdmin,

    // util
    prefetchResources,
    // low-level AdminAPI if needed:
    rawGet: AdminAPI.get,
    rawPost: AdminAPI.post,
    rawPatch: AdminAPI.patch,
    rawDelete: AdminAPI.delete,
  }), [
    admin,
    setAdmin,
    loadingInitial,
    cache,
    getCached,
    updateCacheList,
    fetchResource, // Stable now
    fetchNested,
    forceRefreshResource,
    createResource,
    updateResource,
    deleteResource,
    login,
    logout,
    getCurrentAdmin,
    prefetchResources,
  ]);



  return (
    <AdminContext.Provider value={exposed}>
      {children}
    </AdminContext.Provider>
  );
};