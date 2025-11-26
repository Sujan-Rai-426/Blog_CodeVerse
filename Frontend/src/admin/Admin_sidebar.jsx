import React from "react";
import "../assets/css/Admin_Home.css";
import { FaPlus, FaList, FaEdit, FaHome, FaCog, FaTimes, FaUser } from "react-icons/fa";

export default function Admin_Sidebar({ sidebarOpen, setSidebarOpen, setActivePage, activePage }) {
  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, key: "dashboard" },
    { name: "Add Data", icon: <FaPlus />, key: "add" },
    { name: "View Data", icon: <FaList />, key: "view" },
    { name: "Update Data", icon: <FaEdit />, key: "update" },
    { name: "View Users", icon: <FaUser />, key: "view_users" },
    { name: "Settings", icon: <FaCog />, key: "settings" },
  ];

  return (
    <aside className={`admin-sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
      {/* Mobile Close Button */}
      {sidebarOpen && (
        <button className="mobile-close-btn" onClick={() => setSidebarOpen(false)}>
          <FaTimes />
        </button>
      )}

      <h2 className="sidebar-title">Admin Panel</h2>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.key}
            onClick={() => setActivePage(item.key)}
            className={activePage === item.key ? "active" : ""}
          >
            {item.icon}
            {sidebarOpen && <span>{item.name}</span>}
          </li>
        ))}
      </ul>
    </aside>
  );
}
