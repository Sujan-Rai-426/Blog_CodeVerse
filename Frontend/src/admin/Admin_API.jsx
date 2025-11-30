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
    withCredentials: true, // required for session cookies
});

// ===================== Request Interceptor =====================
Admin_API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("admin_token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// ===================== Response Interceptor =====================
Admin_API.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (!error.response) {
            alert("Network error. Check your connection.");
            return Promise.reject(error);
        }

        const { status } = error.response;

        if (status === 401) {
            // Token invalid or expired → logout
            localStorage.removeItem("admin_token");
            window.location.replace("/Admin_Login");
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
