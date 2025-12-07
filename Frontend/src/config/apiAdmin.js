// src/config/apiAdmin.js
import axios from "axios";

const isProduction = import.meta.env.MODE === "production";
const apiURL = isProduction
  ? import.meta.env.VITE_API_URL_PRODUCTION
  : import.meta.env.VITE_API_URL_DEVELOPMENT;

// Paths
const CSRF_PATH = import.meta.env.VITE_CSRF_PATH || "/api/csrf/";
const ADMIN_REFRESH_PATH =
  import.meta.env.VITE_ADMIN_REFRESH_PATH || "/api/admin/refresh/";

// ------------------- Axios Instance -------------------
const apiAdmin = axios.create({
  baseURL: apiURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ------------------- Fetch CSRF Token Once -------------------
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
apiAdmin.interceptors.request.use(
  (config) => {
    const method = (config.method || "").toLowerCase();

    if (["post", "put", "patch", "delete"].includes(method)) {
      const token = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
      if (token) config.headers["X-CSRFToken"] = token;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

// ------------------- Response Interceptor (Auto Refresh) -------------------
apiAdmin.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    if (
      originalRequest.url?.endsWith(CSRF_PATH) ||
      originalRequest.url?.endsWith(ADMIN_REFRESH_PATH)
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const r = await axios.post(
          `${apiURL}${ADMIN_REFRESH_PATH}`,
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
        console.error("admin refresh failed:", refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default apiAdmin;
