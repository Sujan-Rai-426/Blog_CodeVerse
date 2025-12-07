// src/config/apiClient.js
import axios from "axios";

const isProduction = import.meta.env.MODE === "production";
const apiURL = isProduction
  ? import.meta.env.VITE_API_URL_PRODUCTION
  : import.meta.env.VITE_API_URL_DEVELOPMENT;

// Paths (overridable by env)
const CSRF_PATH = import.meta.env.VITE_CSRF_PATH || "/api/csrf/";
const USER_REFRESH_PATH =
  import.meta.env.VITE_USER_REFRESH_PATH || "/api/user/refresh/";

// ------------------- Axios Instance -------------------
const apiClient = axios.create({
  baseURL: apiURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ------------------- Fetch CSRF Token Once -------------------
export async function fetchClientCsrfToken() {
  try {
    await apiClient.get(CSRF_PATH);
    const token = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
    return token;
  } catch (err) {
    console.error("fetchClientCsrfToken failed:", err);
    throw err;
  }
}

// ------------------- Request Interceptor -------------------
apiClient.interceptors.request.use(
  (config) => {
    const method = (config.method || "").toLowerCase();

    // Only unsafe methods require CSRF token
    if (["post", "put", "patch", "delete"].includes(method)) {
      const token = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
      if (token) config.headers["X-CSRFToken"] = token;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

// ------------------- Response Interceptor (Auto Refresh) -------------------
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // Avoid infinite loops
    if (
      originalRequest.url?.endsWith(CSRF_PATH) ||
      originalRequest.url?.endsWith(USER_REFRESH_PATH)
    ) {
      return Promise.reject(error);
    }

    // If access expired → refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const r = await axios.post(
          `${apiURL}${USER_REFRESH_PATH}`,
          {},
          { withCredentials: true }
        );

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
