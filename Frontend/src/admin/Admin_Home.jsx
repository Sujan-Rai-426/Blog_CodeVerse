// src/pages/Admin_Home.jsx
import React, { useState, useEffect } from "react";
import "../assets/css/Admin_Home.css";
import { FaBars } from "react-icons/fa";
import Admin_Sidebar from "./Admin_sidebar";
import Admin_Dashboard from "./Admin_Dashboard";
import Admin_Add_Data from "./Admin_Add_Data";
import Admin_Update_Data from "./Admin_Update_Data";
import Admin_Settings from "./Admin_Settings";
import Admin_View_Data from "./Admin_View_Data";
import Admin_View_User from "./Admin_View_User";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "./Admin_API_Provider"; // updated import

export default function Admin_Home() {
  const navigate = useNavigate();
  const { admin, fetchAllData, logout, loading, cache } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [adminData, setAdminData] = useState(null);

  // ----------------------------
  // Fetch admin-protected data on mount
  // ----------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllData();
        setAdminData(data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
    };
    loadData();
  }, [fetchAllData]);

  // ----------------------------
  // Handle Logout
  // ----------------------------
  const handleLogout = () => {
    logout(); // clears tokens and cache
    window.location.href = ("/Admin/Login"); // redirect to Admin/login forcefully to prevent nested routing for login
  };

  // ----------------------------
  // Render content based on active page
  // ----------------------------
  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <Admin_Dashboard adminData={adminData || cache.allData} />;
      case "add":
        return <Admin_Add_Data adminData={adminData || cache.allData} />;
      case "view":
        return <Admin_View_Data adminData={adminData || cache.allData} />;
      case "update":
        return <Admin_Update_Data adminData={adminData || cache.allData} />;
      case "view_users":
        return <Admin_View_User adminData={adminData || cache.allData} />;
      case "settings":
        return <Admin_Settings />;
      default:
        return <Admin_Dashboard adminData={adminData || cache.allData} />;
    }
  };

  if (!admin) {
    // not logged in → redirect to login
    navigate("/Admin/Login");
    return null;
  }

  if (loading) return <div>Loading Admin Data...</div>;

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
