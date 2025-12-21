import React, { useState, useEffect } from "react";
import "../assets/css/Admin_Home.css";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "./Admin_API_Context";

import {
    Admin_Sidebar,
    Admin_Dashboard,
    Admin_Add_Data,
    Admin_Update_Data,
    Admin_Settings,
    Admin_Update_User,
} from "./Admin_Imports"



export default function Admin_Home() {
  const navigate = useNavigate();
  const { admin, fetchAllData, logout, loading, cache } = useAdmin();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState(null); // Track fetch error

  const handleLogout = () => {
    logout();
    window.location.href = "/Admin/Login";
  };

  const renderContent = () => {
    const data = adminData || cache.allData || [];
    switch (activePage) {
      case "dashboard":
        return <Admin_Dashboard adminData={data} />;
      case "add":
        return <Admin_Add_Data adminData={data} />;
      case "update_data":
        return <Admin_Update_Data adminData={data} />;
      case "update_user":
        return <Admin_Update_User adminData={data} />;
      case "settings":
        return <Admin_Settings />;
      default:
        return <Admin_Dashboard adminData={data} />;
    }
  };

  if (!admin) {
    navigate("/Admin/Login");
    return null;
  }

  if (loading) return <div>Loading Admin Data...</div>;

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-container">
      <nav className="admin-navbar">
        <button
          className="toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars />
        </button>
        <h1 className="admin-title">CodeVora Admin</h1>
        <button type="button" className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className="admin-body">
        <Admin_Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setActivePage={setActivePage}
          activePage={activePage}
        />
        <div className="container admin-content">{renderContent()}</div>
      </div>
    </div>
  );
}
