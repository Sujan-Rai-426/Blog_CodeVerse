// src/config/Admin_API.js
import axios from "axios";

// ===================== Environment =====================
const isProduction = import.meta.env.MODE === "production";
const apiURL = isProduction
    ? import.meta.env.VITE_API_URL_PRODUCTION // e.g., "https://codevora-backend.vercel.app"
    : import.meta.env.VITE_API_URL_DEVELOPMENT; // e.g., "http://localhost:8000"

// ===================== Axios Instance =====================
const Admin_API = axios.create({
    baseURL: apiURL,
    timeout: 30000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // required for session cookies (refresh token)
});

// ===================== Request Interceptor =====================
Admin_API.interceptors.request.use(
    (config) => {
        // Attach access token from localStorage
        const token = localStorage.getItem("admin_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ===================== Response Interceptor =====================
Admin_API.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Network issues
        if (!error.response) {
            alert("Network error. Please check your connection.");
            return Promise.reject(error);
        }

        const { status } = error.response;

        // =================== 401 Unauthorized ===================
        if (status === 401) {
            try {
                // Attempt token refresh using session cookie
                const refreshResponse = await axios.post(
                    `${apiURL}/api/token/refresh/`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = refreshResponse.data.access;
                localStorage.setItem("admin_token", newAccessToken);

                // Retry the original request with new token
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

        // =================== 403 Forbidden ===================
        if (status === 403) {
            alert("You do not have permission to perform this action.");
        }

        // =================== 5xx Server Errors ===================
        if (status >= 500) {
            alert("Server error. Please try again later.");
        }

        return Promise.reject(error);
    }
);

export default Admin_API;
