
import axios  from "axios";

const isProduction = import.meta.env.MODE === 'production';

const apiURL = isProduction ? import.meta.env.VITE_API_URL_PRODUCTION : import.meta.env.VITE_API_URL_DEVELOPMENT;
// Where VITE_API_URL_PRODUCTION and VITE_API_URL_DEVELOPMENT are defined in the .env file
// and .env file is added in .gitignore

const api = axios.create(
    { baseURL : apiURL }
);

export default api;