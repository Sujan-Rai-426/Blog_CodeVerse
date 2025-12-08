// src/config/apiAdmin.js
import axios from "axios";

const isProduction = import.meta.env.MODE === "production";
const apiURL = isProduction
  ? import.meta.env.VITE_API_URL_PRODUCTION
  : import.meta.env.VITE_API_URL_DEVELOPMENT;

// CSRF path can be overridden via env (e.g. VITE_CSRF_PATH="/api/csrf/")
const CSRF_PATH = import.meta.env.VITE_CSRF_PATH || "/api/csrf/";

// Admin refresh path (override via env if needed)
const ADMIN_REFRESH_PATH = import.meta.env.VITE_ADMIN_REFRESH_PATH || "/api/admin/refresh/";

// axios instance for admin
const apiAdmin = axios.create({
  baseURL: apiURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ------------------- CSRF: fetch once helper -------------------
/**
 * Call this once (login page / app init) before you do unsafe requests.
 * Browser will store csrftoken cookie; interceptor will read it from document.cookie.
 */
export async function fetchAdminCsrfToken() {
  try {
    await apiAdmin.get(CSRF_PATH);
    const token = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
    // optional: console.log("admin csrf:", token);
    return token;
  } catch (err) {
    console.error("fetchAdminCsrfToken failed:", err);
    throw err;
  }
}

// ------------------- Request interceptor -------------------
// Only adds header from cookie; does NOT fetch CSRF on every request (avoid race)
apiAdmin.interceptors.request.use((config) => {
  const method = (config.method || "").toLowerCase();
  if (["post", "put", "patch", "delete"].includes(method)) {
    const token = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
    if (token) config.headers["X-CSRFToken"] = token;
  }
  return config;
}, (err) => Promise.reject(err));

// ------------------- Response interceptor (refresh) -------------------
apiAdmin.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // don't retry the CSRF fetch or refresh endpoints themselves
    if (originalRequest.url?.endsWith(CSRF_PATH) || originalRequest.url?.endsWith(ADMIN_REFRESH_PATH)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // call refresh endpoint (reads refresh cookie)
        const r = await axios.post(`${apiURL}${ADMIN_REFRESH_PATH}`, {}, { withCredentials: true });
        const newAccess = r.data?.access;
        if (newAccess) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
          return axios(originalRequest);
        }
      } catch (refreshErr) {
        console.error("admin refresh failed:", refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default apiAdmin;
