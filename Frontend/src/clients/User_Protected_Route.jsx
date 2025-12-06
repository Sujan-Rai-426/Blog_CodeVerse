import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import apiClient from "../config/apiClient";

export default function User_Protected_Route() {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    apiClient
      .get("/api/user-profile/")
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false));
  }, []);

  if (authenticated === null) return <p>Loading...</p>;

  return authenticated ? <Outlet /> : <Navigate to="/User/Login" replace />;
}
