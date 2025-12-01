import React, { useState, useEffect } from "react";
import "../assets/css/Admin_Home.css";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import Admin_Sidebar from "./Admin_sidebar";
import Admin_Dashboard from "./Admin_Dashboard";
import Admin_Add_Data from "./Admin_Add_Data";
import Admin_Update_Data from "./Admin_Update_Data";
import Admin_Settings from "./Admin_Settings";
import Admin_View_Data from "./Admin_View_Data";
import Admin_View_User from "./Admin_View_User";

import { useAdmin } from "./Admin_API_Provider";

export default function Admin_Home() {
  const navigate = useNavigate();
  const { admin, fetchAllData, logout, loading, cache } = useAdmin();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState(null); // Track fetch error

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const data = await fetchAllData();
        if (isMounted) {
          setAdminData(data);
          setError(null); // clear any previous errors
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching admin data:", err);
          setError("Failed to load admin data. Please try again later.");
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchAllData]);

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
      case "view":
        return <Admin_View_Data adminData={data} />;
      case "update":
        return <Admin_Update_Data adminData={data} />;
      case "view_users":
        return <Admin_View_User adminData={data} />;
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
