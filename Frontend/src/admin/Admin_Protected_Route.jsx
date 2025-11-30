import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const Admin_Protected_Route = () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return <Navigate to="/Admin_Login" replace />;
    return <Outlet />; // Admin_API_Provider will fetch data
};

export default Admin_Protected_Route;
