// routes/User_Protected_Route.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { TokenService } from "../utils/token";

export default function User_Protected_Route() {
  const token = TokenService.getUserAccess();

  return token ? <Outlet /> : <Navigate to="/User/Login" replace />;
}
