import { Navigate, Outlet } from "react-router-dom";

export default function User_Protected_Route() {
  const clientId = localStorage.getItem("client_id");

  if (!clientId) return <Navigate to="/User/Login/" replace />;

  return <Outlet />;
}
