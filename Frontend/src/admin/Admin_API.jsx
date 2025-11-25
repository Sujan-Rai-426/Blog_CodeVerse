import axios from "axios";

// Determine API base URL based on environment
const isProduction = import.meta.env.MODE === "production";
const apiURL = isProduction
    ? import.meta.env.VITE_API_URL_PRODUCTION
    : import.meta.env.VITE_API_URL_DEVELOPMENT;

// Create Axios instance
const Admin_API = axios.create({
    baseURL: apiURL,
    timeout: 30000, // 10 seconds
    headers: { "Content-Type": "application/json" },
});

// =================== Request Interceptor ===================
// Attach JWT token to every request if available
Admin_API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("admin_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// =================== Response Interceptor ===================
// Auto logout on 401 Unauthorized
Admin_API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const {status} = error.response;

            // Handle Unauthorized
            if (status === 401) {
                localStorage.removeItem("admin_token");
                alert("Session expired. Please login again.");
                window.location.replace("/Admin_Login");
            }

            // Optional: Handle other common errors
            if (status === 403) {
                alert("You do not have permission to perform this action.");
            }
            if (status >= 500) {
                alert("Server error. Please try again later.");
            }
        } else {
        // Network or CORS error
            alert("Network error. Please check your internet connection.");
        }

        return Promise.reject(error);
    }
);

export default Admin_API;
