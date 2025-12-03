import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function User_Protected_Route() {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const backend = import.meta.env.DEV
      ? "http://127.0.0.1:8000"
      : "https://codevora-backend.vercel.app";

    fetch(`${backend}/api/current-user/`, {
      credentials: "include", // Important: send cookies
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) return <p>Checking authentication...</p>;

  return isAuth ? <Outlet /> : <Navigate to="/User/Login" replace />;
}
