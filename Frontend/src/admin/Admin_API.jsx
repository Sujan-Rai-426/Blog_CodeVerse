import axios from "axios";

// Determine environment
const isProduction = import.meta.env.MODE === "production";
const apiURL = isProduction
  ? import.meta.env.VITE_API_URL_PRODUCTION
  : import.meta.env.VITE_API_URL_DEVELOPMENT;

// Axios instance
const Admin_API = axios.create({
  baseURL: apiURL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // needed to send cookies (refresh token)
});

// =================== Request Interceptor ===================
Admin_API.interceptors.request.use(
  (config) => {
    // Use access token from localStorage
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =================== Response Interceptor ===================
Admin_API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      alert("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    const { status } = error.response;

    if (status === 401) {
      // Access token expired → try refresh token
      try {
        const refreshResponse = await axios.post(
          `${apiURL}/api/token/refresh/`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem("admin_token", newAccessToken);

        // Retry original request
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(error.config);
      } catch (refreshError) {
        // Refresh failed → logout
        localStorage.removeItem("admin_token");
        alert("Session expired. Please login again.");
        window.location.replace("/Admin_Login");
        return Promise.reject(refreshError);
      }
    }

    if (status === 403) {
      alert("You do not have permission to perform this action.");
    }
    if (status >= 500) {
      alert("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default Admin_API;
