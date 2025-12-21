// src/components/Admin_Routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { AdminProvider } from "./Admin_API_Provider";

import {
    Admin_Login,
    Admin_Home,
    AdminProtected,
} from "./Admin_Imports"


export default function Admin_Routes() {
  return (
    <AdminProvider>
      <div style={{ minHeight: "100vh" }}>
        <Routes>
          {/* Public Admin Login */}
          <Route exact path="Login" element={<Admin_Login />} />

          {/* Protected Admin Routes */}
          <Route exact path="/" element={<AdminProtected />}>
              <Route index element={<Admin_Home />} />
          </Route>
        </Routes>
      </div>
    </AdminProvider>
  );
}
