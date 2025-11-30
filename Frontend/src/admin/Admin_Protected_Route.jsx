// Admin_Protected_Route.jsx
import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Admin_API from "./Admin_API";

const Admin_Protected_Route = () => {
    const [isAuth, setIsAuth] = useState(null);
    const [adminData, setAdminData] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await Admin_API.get("/api/admin/all-data/");
                setAdminData(res.data);
                setIsAuth(true);
            } catch {
                setIsAuth(false);
            }
        };
        checkAuth();
    }, []);

    if (isAuth === null) return <div>Loading...</div>;
    if (!isAuth) return <Navigate to="/Admin_Login" replace />;

    return <Outlet context={{ adminData }} />;
};

export default Admin_Protected_Route;
