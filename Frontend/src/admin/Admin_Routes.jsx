// src/components/Admin_Routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Admin_Login from "./Admin_Login";
import Admin_Home from "./Admin_Home";
import Admin_Add_Data from "./Admin_Add_Data";
import Admin_Update_Data from "./Admin_Update_Data";
import Admin_Settings from "./Admin_Settings";
import Admin_View_User from "./Admin_View_User";

import AdminProtected from "./Admin_Protected_Route";
import { AdminProvider } from "./Admin_API_Provider";

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
            <Route exact path="Add" element={<Admin_Add_Data />} />
            <Route exact path="Update" element={<Admin_Update_Data />} />
            <Route exact path="Settings" element={<Admin_Settings />} />
            <Route exact path="User_Data" element={<Admin_View_User />} />
          </Route>
        </Routes>
      </div>
    </AdminProvider>
  );
}
