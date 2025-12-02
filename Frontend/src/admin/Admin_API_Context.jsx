// src/context/Admin_API_Context.jsx
import { createContext, useContext } from "react";

// =================== CREATE CONTEXT ===================
// This will hold admin state, cache, and all API methods
export const AdminContext = createContext();

// =================== CUSTOM HOOK ===================
// useAdmin allows any component to access admin context easily
export const useAdmin = () => useContext(AdminContext);
