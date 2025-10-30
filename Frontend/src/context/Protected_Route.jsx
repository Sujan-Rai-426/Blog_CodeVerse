import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const Protected_Route = () => {
    const isLoggedIn = window.localStorage.getItem("loggedIn") === "true";
    return isLoggedIn ? <Outlet /> : <Navigate to="/Admin_Login" replace />;

};

export default Protected_Route;
