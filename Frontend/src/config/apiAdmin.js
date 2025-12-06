// ==================== src/config/apiAdmin.js ====================
import axios from "axios";

const isProduction = import.meta.env.MODE === "production";

const apiURL = isProduction
  ? import.meta.env.VITE_API_URL_PRODUCTION
  : import.meta.env.VITE_API_URL_DEVELOPMENT;

// Helper to read CSRF cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// Axios instance for Admin
const apiAdmin = axios.create({
  baseURL: apiURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach CSRF token only for unsafe methods
apiAdmin.interceptors.request.use((config) => {
  const csrfToken = getCookie("csrftoken");
  if (csrfToken && ["post", "put", "patch", "delete"].includes(config.method)) {
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
});

// Response interceptor: refresh token logic
apiAdmin.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (originalRequest.url.endsWith("/api/csrf/")) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${apiURL}/api/admin/refresh/`, {}, { withCredentials: true });
        const newAccessToken = res.data.access;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Admin refresh token invalid:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiAdmin;