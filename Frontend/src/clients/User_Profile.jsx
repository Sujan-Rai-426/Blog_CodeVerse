// src/pages/User_Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAPI } from "./User_API_Context";
import apiClient from "../config/apiClient";
import "../assets/css/User_Profile.css";
import "../assets/css/Components_Design.css";
import CodeVora_Logo from "../assets/img/About_img/CodeVora.png"

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


  // <----------- handle LogOut---------------->
  const handleLogout = async () => {
    try {
          await apiClient.post("/api/user-logout/");
      } finally {
          navigate("/User/Login");
      }
  };


  // <----------- handle Edit Profile---------------->



  const contentTabs = [
      { name: "Favourite", icon: FaHeart },
      { name: "Purchased", icon: FaShoppingBag },
      { name: "Play List", icon: FaList },
      { name: "History", icon: FaHistory },
  ];


  // ================ iframe Doc ======================
  const buildIframeDoc = (html = "", css = "", js = "", aspectWidth = 320, aspectHeight = 450) => {
    const trimmedJs = (js || "").toString().trim();
    const safeJs = trimmedJs ? trimmedJs.replace(/<\/script>/gi, "<\\/script>") : "";
    return `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: transparent;
          overflow: hidden;
        }
        .scaleWrapper {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        .scaleInner {
          width: ${aspectWidth}px;
          height: ${aspectHeight}px;
          display: flex;
          justify-content: center;
          align-items: center;
          transform-origin: center center;
        }
        ${css || ""}
      </style>
    </head>
    <body>
      <div class="scaleWrapper">
        <div class="scaleInner" id="scaleInner">
          ${html || ""}
        </div>
      </div>
      <script>
        try {
          ${safeJs}
        } catch(err) {
          console.error("Preview JS error:", err);
        }
        function resizeScale() {
          const inner = document.getElementById("scaleInner");
          if (!inner) return;
          const naturalWidth = inner.offsetWidth;
          const naturalHeight = inner.offsetHeight;
          const scale = Math.min(
            window.innerWidth / naturalWidth,
            window.innerHeight / naturalHeight
          );
          inner.style.transform = 'scale(' + scale + ')';
        }
        window.addEventListener('load', resizeScale);
        window.addEventListener('resize', resizeScale);
      </script>
    </body>
    </html>`;
  };



  // =================== SKELETON LOADER Contetional rendering=======================
if (loading || (!profile && !favorites.length && !playlists.length)) {
  return (
      <div className="profile-container">
        {/* Skeleton Header */}
          <div className="profile-header">
              <div className="skeleton-element skeleton-avatar"></div>
              <div className="profile-info-main" style={{ flex: 1 }}>
                  <div className="skeleton-line large"></div> {/* Username */}
                  <div className="skeleton-element skeleton-button"></div> {/* Edit */}
                  <div className="skeleton-element skeleton-button"></div> {/* Logout */}
                  <div className="skeleton-line full"></div> {/* Email */}
              </div>
          </div>

        {/* Skeleton Tabs */}
          <div className="skeleton-tab-bar">
              {[...Array(4)].map((_, i) => (
                  <div key={i} className="skeleton-tab-button">
                      <div className="skeleton-icon-large"></div>
                      <div className="skeleton-line-tab-label"></div>
                  </div>
              ))}
          </div>

        {/* Skeleton Content Grid */}
          <div className="content-grid">
              {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton-post-card"></div>
              ))}
          </div>
      </div>
  );
}


  if (error) return <p>Error: {JSON.stringify(error)}</p>;




  return (
    <div className="profile-container">
      {/* Header */}
        <header className="profile-header">
            <div className="profile-avatar-wrapper">
                <img
                  src={profile.avatar_url || CodeVora_Logo}
                  alt={`${profile.username}'s Avatar`}
                  className="profile-avatar"
                />
            </div>
            <div className="profile-info-main">
                <div className="profile-name-actions">
                    <h1 className="profile-username">{profile.username}</h1>
                    <div className="profile-btn-grp">
                        <button className="profile-edit-btn" onClick={onEditClick} ><FaUserEdit /> Edit Profile</button>
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

        {/* =================== Tab Content =================== */}
          <h3 className="tab-content-heading">{activeTab} Content</h3>
          <div className="content-grid">
              {tabContent.length > 0 ? (
                  tabContent.map(item => {
                      // Extract code_detail safely
                      const code = item.code_detail || {};

                      return (
                          <div key={item.id} className="content-placeholder">

                            {/* ===== Favourite Tab ===== */}
                            {activeTab === "Favourite" && (
                              <div
                                  className="favourite-card"
                                  style={{
                                    position: "relative",
                                    cursor: "pointer",
                                    background: "transparent",
                                    borderRadius: 10,
                                    padding: 10,
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.08)"
                                  }}
                                  onClick={() => navigate(`/Components/${code.topic_id}/${code.id}`)}
                              >
                                {/* Premium Badge */}
                                {code.access_type === "Premium" && (
                                    <div
                                      style={{
                                        position: "absolute",
                                        top: 10,
                                        right: 10,
                                        background: "gold",
                                        padding: "3px 8px",
                                        borderRadius: 5,
                                        fontSize: 12,
                                        fontWeight: "bold",
                                        color: "#000",
                                        zIndex: 20,
                                      }}
                                    >
                                        <i className="bi bi-gem"></i> &nbsp; ${code.price || 0}
                                    </div>
                                )}

                                {/* Iframe Preview */}
                                <iframe
                                  srcDoc={buildIframeDoc(
                                    code.html_code || "",
                                    code.css_code || "",
                                    code.js_code || "",
                                    320,
                                    450
                                  )}
                                  sandbox="allow-scripts allow-forms allow-modals"
                                  title={code.title || "Preview"}
                                  style={{
                                    width: "100%",
                                    height: 180,
                                    border: "none",
                                    borderRadius: 8,
                                    marginBottom: 8,
                                  }}
                                />

                                {/* Title */}
                                <div
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 600,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                  }}
                                >
                                    <i className="bi bi-arrow-right"></i> {code.title || "Untitled"}
                                </div>
                              </div>
                            )}

                            {/* ===== Play List Tab ===== */}
                            {activeTab === "Play List" && <div>{item.name}</div>}
                          </div>
                      );
                  })
              ) : (
                  <p>No {activeTab} items found.</p>
              )}
          </div>
      </section>
    </div>
  );
}
