// src/components/Admin_Protected_Route.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAdmin } from "./Admin_API_Context";

export default function AdminProtected() {
  const { admin } = useAdmin();

  if (!admin) {
    // Not logged in → redirect to login
    return <Navigate to="/Admin/Login" replace />;
  }

  // Logged in → render nested routes
  return <Outlet />;
}
