// src/config/apiClient.js
import axios from "axios";

const isProduction = import.meta.env.MODE === "production";
const apiURL = isProduction
    ? import.meta.env.VITE_API_URL_PRODUCTION
    : import.meta.env.VITE_API_URL_DEVELOPMENT;

const CSRF_PATH = "/api/csrf/";
const USER_REFRESH_PATH = "/api/user/refresh/";

/* ------------------- Axios instance ------------------- */
const apiClient = axios.create({
    baseURL: apiURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

/* ------------------- CSRF helper ------------------- */
export async function fetchClientCsrfToken() {
    await apiClient.get(CSRF_PATH);
    return document.cookie.match(/csrftoken=([^;]+)/)?.[1];
}

/* ------------------- Request interceptor ------------------- */
apiClient.interceptors.request.use(
    (config) => {
        const method = (config.method || "").toLowerCase();
        if (["post", "put", "patch", "delete"].includes(method)) {
            const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
            if (csrfToken) {
                config.headers["X-CSRFToken"] = csrfToken;
            }
        }
        return config;
    },
    (err) => Promise.reject(err)
);

/* ------------------- Response interceptor ------------------- */
apiClient.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);
        if (
            originalRequest.url?.endsWith(CSRF_PATH) ||
            originalRequest.url?.endsWith(USER_REFRESH_PATH)
        ) {
            return Promise.reject(error);
        }
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
                const refreshRes = await axios.post(
                    `${apiURL}${USER_REFRESH_PATH}`,
                    {},
                    {
                        withCredentials: true,
                        headers: csrfToken ? { "X-CSRFToken": csrfToken } : {},
                    }
                );
                const newAccess = refreshRes.data?.access;
                if (newAccess) {
                    originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
                    return axios(originalRequest);
                }
            } catch (err) {
                console.error("Token refresh failed", err);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
