import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const User_Protected_Route = () => {
    const token = localStorage.getItem("user_token"); // ✅ same key
    return token ? <Outlet /> : <Navigate to="/User/Login" replace />;
};

export default User_Protected_Route;
