// ==================== src/config/apiClient.js ====================
import axios from "axios";

const isProduction = import.meta.env.MODE === "production";
const apiURL = isProduction
  ? import.meta.env.VITE_API_URL_PRODUCTION
  : import.meta.env.VITE_API_URL_DEVELOPMENT;

// Axios instance for Client
const apiClient = axios.create({
  baseURL: apiURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Ensure CSRF cookie is set before unsafe requests
async function ensureClientCsrf() {
  try {
    await apiClient.get("/api/csrf/"); // sets csrftoken cookie
  } catch (err) {
    console.error("Failed to fetch CSRF token:", err);
  }
}

// Attach CSRF token automatically before unsafe requests
apiClient.interceptors.request.use(async (config) => {
  if (["post", "put", "patch", "delete"].includes(config.method)) {
    await ensureClientCsrf();
    const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
  }
  return config;
});

// Response interceptor: refresh token logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not retry CSRF endpoint
    if (originalRequest.url.endsWith("/api/csrf/")) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${apiURL}/api/user/refresh/`, {}, { withCredentials: true });
        const newAccessToken = res.data.access;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("User refresh token invalid:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
