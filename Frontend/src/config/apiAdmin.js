// src/config/apiAdmin.js
import axios from "axios";

const isProduction = import.meta.env.MODE === "production";
const apiURL = isProduction
    ? import.meta.env.VITE_API_URL_PRODUCTION
    : import.meta.env.VITE_API_URL_DEVELOPMENT;

const CSRF_PATH = import.meta.env.VITE_CSRF_PATH || "/api/csrf/";
const ADMIN_REFRESH_PATH = import.meta.env.VITE_ADMIN_REFRESH_PATH || "/api/admin/refresh/";

// Axios instance
const apiAdmin = axios.create({
    baseURL: apiURL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

// ------------------- CSRF fetch helper -------------------
export async function fetchAdminCsrfToken() {
    try {
        await apiAdmin.get(CSRF_PATH);
        const token = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
        return token;
    } catch (err) {
        console.error("fetchAdminCsrfToken failed:", err);
        throw err;
    }
}

// ------------------- Request Interceptor -------------------
apiAdmin.interceptors.request.use((config) => {
    const method = (config.method || "").toLowerCase();

    const access = document.cookie.match(/access_admin_token=([^;]+)/)?.[1];
    if (access) config.headers["Authorization"] = `Bearer ${access}`;

    if (["post", "put", "patch", "delete"].includes(method)) {
        const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
        if (csrfToken) config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
});

// ------------------- Response Interceptor -------------------
apiAdmin.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        if (
            originalRequest.url?.endsWith(CSRF_PATH) ||
            originalRequest.url?.endsWith(ADMIN_REFRESH_PATH)
        ) return Promise.reject(error);

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const r = await axios.post(`${apiURL}${ADMIN_REFRESH_PATH}`, {}, { withCredentials: true });
                const newAccess = r.data?.access;
                if (newAccess) {
                    // Update cookie
                    document.cookie = `access_admin_token=${newAccess}; path=/;`;
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

// ------------------- Persistent login on page load -------------------
export async function adminPersistentLogin() {
    const refreshToken = document.cookie.match(/refresh_admin_token=([^;]+)/)?.[1];
    if (!refreshToken) return;

    try {
        const r = await axios.post(`${apiURL}${ADMIN_REFRESH_PATH}`, {}, { withCredentials: true });
        const newAccess = r.data?.access;
        if (newAccess) {
            document.cookie = `access_admin_token=${newAccess}; path=/;`;
            console.log("Admin persistent login success");
        }
    } catch (err) {
        console.warn("Admin persistent login failed", err);
    }
}

export default apiAdmin;
