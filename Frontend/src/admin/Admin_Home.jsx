import React, { useState } from "react";
import "../assets/css/Admin_Home.css";
import { FaBars } from "react-icons/fa";
import Admin_Sidebar from "./Admin_sidebar";
import Admin_Dashboard from "./Admin_Dashboard";
import Admin_Add_Data from "./Admin_Add_Data";
import Admin_Update_Data from "./Admin_Update_Data";
import Admin_Settings from "./Admin_Settings";
import Admin_View_Data from "./Admin_View_Data";
import { useNavigate, useOutletContext } from "react-router-dom";
import Admin_View_User from "./Admin_View_User";

export default function Admin_Home() {
  const navigate = useNavigate();
  const { adminData } = useOutletContext(); // Get all DB data from Protected Route
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard"); // current content

  // =================== LOGOUT ===================
  const handleLogout = () => {
    window.localStorage.removeItem("loggedIn"); // optional
    window.localStorage.removeItem("access_token"); // optional
    navigate("/Admin/Admin_Login");
  };

  // Render main content based on activePage
  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <Admin_Dashboard adminData={adminData} />; // pass adminData
      case "add":
        return <Admin_Add_Data adminData={adminData} />;
      case "view":
        return <Admin_View_Data adminData={adminData} />;
      case "update":
        return <Admin_Update_Data adminData={adminData} />;
      case "view_users":
        return <Admin_View_User adminData={adminData} />;
      case "settings":
        return <Admin_Settings />;
      default:
        return <Admin_Dashboard adminData={adminData} />;
    }
  };

  return (
    <div className="admin-container">
      {/* NAVBAR */}
      <nav className="admin-navbar">
        <button
          className="toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars />
        </button>
        <h1 className="admin-title">CodeVora Admin</h1>

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
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

        <div className="admin-content">{renderContent()}</div>
      </div>
    </div>
  );
}
