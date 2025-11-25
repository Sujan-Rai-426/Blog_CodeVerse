import React, { useState } from "react";
import "../assets/css/Admin_Home.css";
import { FaBars } from "react-icons/fa";
import Admin_Sidebar from "./Admin_sidebar";
import Admin_Dashboard from "./Admin_Dashboard";
import Admin_Add_Data from "./Admin_Add_Data";
import Admin_Update_Data from "./Admin_Update_Data";
import Admin_Settings from "./Admin_Settings";
import Admin_View_Data from "./Admin_View_Data";
import { useNavigate } from "react-router-dom";


export default function Admin_Home() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activePage, setActivePage] = useState("dashboard"); // current content

      // =================== LOGOUT ===================
    const handleLogout = () => {
        // adjust key names to whatever you store (token / loggedIn etc)
        window.localStorage.removeItem("loggedIn");
        window.localStorage.removeItem("access_token");
        navigate("/Admin_Login");
    };

    // Render main content based on activePage
    const renderContent = () => {
        switch (activePage) {
            case "dashboard":
                return <Admin_Dashboard />;
            case "add":
                return <Admin_Add_Data />;
            case "view":
                return <Admin_View_Data />;
            case "update":
                return <Admin_Update_Data />;
            case "settings":
                return <Admin_Settings />;
            default:
                return <Admin_Dashboard />;
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
          setActivePage={setActivePage} // pass function to update content
          activePage={activePage}
        />

        <div className="admin-content">{renderContent()}</div>
      </div>
    </div>
  );
}
