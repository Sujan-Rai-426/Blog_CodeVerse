import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const User_Protected_Route = () => {
    const [token, setToken] = useState(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const t = localStorage.getItem("user_token");
        setToken(t);
        setChecked(true);
    }, []);

    if (!checked) return <p>Checking authentication...</p>;

    return token ? <Outlet /> : <Navigate to="/User/Login" replace />;
};

export default User_Protected_Route;
