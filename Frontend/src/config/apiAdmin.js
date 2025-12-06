import axios from "axios";

const isProduction = import.meta.env.MODE === "production";
const apiURL = isProduction
  ? import.meta.env.VITE_API_URL_PRODUCTION
  : import.meta.env.VITE_API_URL_DEVELOPMENT;

// Axios instance for Admin
const apiAdmin = axios.create({
  baseURL: apiURL,
  withCredentials: true, // needed for cross-site cookies
  headers: { "Content-Type": "application/json" },
});

// ------------------- CSRF Handling -------------------

// Fetch CSRF token once before any unsafe request
export async function fetchAdminCsrfToken() {
  try {
    await apiAdmin.get("/api/csrf/"); // sets csrftoken cookie
    const token = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
    console.log("Admin CSRF token ready:", token);
    return token;
  } catch (err) {
    console.error("Failed to fetch admin CSRF:", err);
  }
}

// Attach CSRF token automatically
apiAdmin.interceptors.request.use((config) => {
  if (["post", "put", "patch", "delete"].includes(config.method)) {
    const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
    if (csrfToken) config.headers["X-CSRFToken"] = csrfToken;
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
