// src/pages/User_Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAPI } from "./User_API_Context";
import apiClient from "../config/apiClient";
import "../assets/css/User_Profile.css";

import { 
  FaMapMarkerAlt, FaEnvelope, FaPhone, FaCalendarAlt, FaUserEdit, 
  FaSignOutAlt, FaHeart, FaShoppingBag, FaList, FaHistory 
} from 'react-icons/fa';

export default function User_Profile({ onEditClick }) {
  const navigate = useNavigate();
  const { profile, favorites, playlists, loading, error, refetchFavorites, refetchPlaylists } = useUserAPI();

  const [activeTab, setActiveTab] = useState("Favourite");
  const [tabContent, setTabContent] = useState([]);

  // Update tab content when favorites/playlists or activeTab changes
  useEffect(() => {
    switch (activeTab) {
      case "Favourite":
        setTabContent(favorites);
        break;
      case "Play List":
        setTabContent(playlists);
        break;
      default:
        setTabContent([]);
    }
  }, [activeTab, favorites, playlists]);

  // Logout
  const handleLogout = async () => {
    try {
      await apiClient.post("/api/user-logout/");
    } finally {
      navigate("/User/Login");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {JSON.stringify(error)}</p>;
  if (!profile) return <p>No profile found.</p>;

  const contentTabs = [
    { name: "Favourite", icon: FaHeart },
    { name: "Purchased", icon: FaShoppingBag },
    { name: "Play List", icon: FaList },
    { name: "History", icon: FaHistory },
  ];

  return (
    <div className="profile-container">
      {/* Header */}
      <header className="profile-header">
        <div className="profile-avatar-wrapper">
          <img
            src={profile.avatar_url || `https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?fm=jpg&q=60&w=3000`}
            alt={`${profile.username}'s Avatar`}
            className="profile-avatar"
          />
        </div>
        <div className="profile-info-main">
          <div className="profile-name-actions">
            <h1 className="profile-username">{profile.username}</h1>
            <div className="profile-btn-grp">
              <button className="profile-edit-btn" onClick={onEditClick}><FaUserEdit /> Edit Profile</button>
              <button className="profile-logout-btn" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
            </div>
          </div>
          <p>{profile.email}</p>
        </div>
      </header>

      {/* Tabs */}
      <section className="profile-content-section">
        <div className="profile-tab-bar">
          {contentTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.name}
                className={`profile-tab-button ${activeTab === tab.name ? "active" : ""}`}
                onClick={() => setActiveTab(tab.name)}
              >
                <Icon className="tab-icon" />
                <span className="tab-label">{tab.name}</span>
              </button>
            );
          })}
        </div>

        <h3 className="tab-content-heading">{activeTab} Content</h3>
        <div className="content-grid">
          {tabContent.length > 0 ? (
            tabContent.map(item => (
              <div key={item.id} className="content-placeholder">
                {activeTab === "Favourite" && item.code?.title}
                {activeTab === "Play List" && item.name}
              </div>
            ))
          ) : (
            <p>No {activeTab} items found.</p>
          )}
        </div>
      </section>
    </div>
  );
}
