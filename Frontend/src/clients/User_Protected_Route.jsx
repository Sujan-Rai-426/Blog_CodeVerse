import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const User_Protected_Route = () => {
    const isLoggedIn = localStorage.getItem("user_token") !== null;
    return isLoggedIn ? <Outlet /> : <Navigate to="/User/Login" replace />;
};

export default User_Protected_Route;
