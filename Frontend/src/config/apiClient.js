// src/config/apiClient.js
import axios from "axios";

const isProduction = import.meta.env.MODE === "production";
const apiURL = isProduction
  ? import.meta.env.VITE_API_URL_PRODUCTION
  : import.meta.env.VITE_API_URL_DEVELOPMENT;

// CSRF and refresh paths (override via env if needed)
const CSRF_PATH = import.meta.env.VITE_CSRF_PATH || "/api/csrf/";
const USER_REFRESH_PATH = import.meta.env.VITE_USER_REFRESH_PATH || "/api/user/refresh/";

// axios instance for client
const apiClient = axios.create({
  baseURL: apiURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ------------------- CSRF: fetch once helper -------------------
export async function fetchClientCsrfToken() {
  try {
    await apiClient.get(CSRF_PATH);
    const token = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
    // optional: console.log("client csrf:", token);
    return token;
  } catch (err) {
    console.error("fetchClientCsrfToken failed:", err);
    throw err;
  }
}

// ------------------- Request interceptor -------------------
apiClient.interceptors.request.use((config) => {
  const method = (config.method || "").toLowerCase();
  if (["post", "put", "patch", "delete"].includes(method)) {
    const token = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
    if (token) config.headers["X-CSRFToken"] = token;
  }
  return config;
}, (err) => Promise.reject(err));

// ------------------- Response interceptor (refresh) -------------------
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    if (originalRequest.url?.endsWith(CSRF_PATH) || originalRequest.url?.endsWith(USER_REFRESH_PATH)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const r = await axios.post(`${apiURL}${USER_REFRESH_PATH}`, {}, { withCredentials: true });
        const newAccess = r.data?.access;
        if (newAccess) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
          return axios(originalRequest);
        }
      } catch (refreshErr) {
        console.error("client refresh failed:", refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
