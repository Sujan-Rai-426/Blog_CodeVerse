import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Admin_API from "../admin/Admin_API";

const Admin_Protected_Route = () => {
    const [isAuth, setIsAuth] = useState(null); // null = loading
    const [adminData, setAdminData] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await Admin_API.get("/api/admin/all-data/"); // fetch all content data
                setAdminData(res.data);
                setIsAuth(true);
                localStorage.setItem("admin_data", JSON.stringify(res.data)); // optional caching
            } catch (err) {
                console.error("Admin auth/data fetch error:", err);
                setIsAuth(false);
            }
        };
        checkAuth();
    }, []);

    if (isAuth === null) return <div>Loading...</div>; // show loading while checking
    if (!isAuth) return <Navigate to="/Admin_Login" replace />;

  return <Outlet context={{ adminData }} />; // pass all DB data to admin pages
};

export default Admin_Protected_Route;
