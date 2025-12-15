// src/pages/User_Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAPI } from "./User_API_Context";
import apiClient from "../config/apiClient";
import "../assets/css/User_Profile.css"; // Ensure this CSS file is used
import "../assets/css/Components_Design.css";
import CodeVora_Logo from "../assets/img/About_img/CodeVora.png";

import { 
  FaUserEdit, FaSignOutAlt, FaHeart, FaShoppingBag, FaList, FaHistory, 
  FaAngleRight, FaAngleDown, FaFolderOpen 
} from 'react-icons/fa';

export default function User_Profile({ onEditClick }) {
    const navigate = useNavigate();
    const { profile, favorites, loading, error } = useUserAPI();
    const [activeTab, setActiveTab] = useState("Favourite");
    
    // State to track the currently expanded playlist topic name
    const [expandedTopic, setExpandedTopic] = useState(null); 

    // ----------------- Tab Definitions -----------------
    const contentTabs = [
        { name: "Favourite", icon: FaHeart },
        { name: "Purchased", icon: FaShoppingBag },
        { name: "Play List", icon: FaList }, 
        { name: "History", icon: FaHistory },
    ];


    // ----------------- Logout -----------------
    const handleLogout = async () => {
        try {
            await apiClient.post("/api/user-logout/");
        } finally {
            navigate("/User/Login");
        }
    };


    // ----------------- Group Favorites by Topic -----------------
    const groupFavoritesByTopic = (items = []) => {
        return items.reduce((acc, item) => {
            const code = item.code_detail || {}; 
            const topicName = code.topic_name || "Uncategorized Code"; 
            
            if (!acc[topicName]) acc[topicName] = [];
            acc[topicName].push(item);
            return acc;
        }, {});
    };
    
    const groupedFavoritesAsPlaylists = groupFavoritesByTopic(favorites);


    // ----------------- Toggle Playlist Handler -----------------
      const handleTopicClick = (topicName) => {
          setExpandedTopic(prevTopic => 
              prevTopic === topicName ? null : topicName // Toggle collapse
          );
      };


    // ----------------- Build Iframe Preview (Mini Iframe) -----------------
      const buildIframeDoc = (html = "", css = "", js = "", aspectWidth = 320, aspectHeight = 450) => {
        const safeJs = (js || "").replace(/<\/script>/gi, "<\\/script>");
        return `
          <!doctype html>
          <html lang="en">
          <head>
              <meta charset="utf-8"/>
              <meta name="viewport" content="width=device-width, initial-scale=1"/>
              <style>
                  html, body { 
                      margin:0; 
                      padding:0; 
                      width:100%; 
                      height:100%; 
                      display:flex; 
                      justify-content:center; 
                      align-items:center; 
                      background:transparent; 
                      overflow:hidden; 
                  }
                  .scaleWrapper { 
                      width:100%; 
                      height:100%; 
                      display:flex; 
                      justify-content:center; 
                      align-items:center; 
                      overflow:hidden; 
                  }
                  .scaleInner { 
                      max-width:100%; 
                      max-height:100%; 
                      width:${aspectWidth}px; 
                      height:${aspectHeight}px; 
                      display:flex; 
                      justify-content:center; 
                      align-items:center; 
                      transform-origin:center center; 
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
                      const scaleX = window.innerWidth / ${aspectWidth};
                      const scaleY = window.innerHeight / ${aspectHeight};
                      const scale = Math.min(scaleX, scaleY);
                      inner.style.transform = 'scale(' + scale + ')';
                  }
                  window.addEventListener('load', resizeScale);
                  window.addEventListener('resize', resizeScale);
                  resizeScale(); 
              </script>
          </body>
          </html>
        `;
      };



    //-------------------------------------------------------------------- 
    // ******************* Content Rendering Function *******************
    //-------------------------------------------------------------------- 
    const renderContent = () => {

      // ************    1. Favourite Tab (Standard Grid)   *************
        if (activeTab === "Favourite") {
            if (favorites.length === 0) {
                return <p>No Favourite items found.</p>;
            }
            return favorites.map(item => {
                const code = item.code_detail || {};
                return (
                    <div
                      key={item.id}
                      className="up-favourite-card up-card-style"
                      onClick={() => navigate(`/Components/${code.topic_id}/${code.id}`)}
                    >
                        <iframe
                          srcDoc={buildIframeDoc(code.html_code, code.css_code, code.js_code, 320, 450)}
                          sandbox="allow-scripts allow-forms allow-modals"
                          title={code.title || "Preview"}
                          className="up-card-iframe"
                        />
                        <div className="up-card-title-text"> &nbsp; ▶ &nbsp; {code.title || "Untitled"}</div>
                    </div>
                );
            });
        }


      // ************  2. Play List Tab (YouTube Style Collapsible List)  ************
        if (activeTab === "Play List") {
            if (favorites.length === 0) {
                return <p>No items found in your Favourites to create a Play List.</p>;
            }
            const topics = Object.keys(groupedFavoritesAsPlaylists);
            return (
              // Wrapper for the entire playlist structure
                <div className="up-playlist-wrapper" style={{ gridColumn: '1 / -1', width: '100%' }}>
                    {topics.map(topic => {
                        const isExpanded = expandedTopic === topic;
                        const items = groupedFavoritesAsPlaylists[topic];
                        const ToggleIcon = isExpanded ? FaAngleDown : FaAngleRight;
                        const TopicIcon = isExpanded ? FaFolderOpen : FaList;
                        return (
                            <div key={topic} className="up-playlist-topic-container">
                              {/* Clickable Topic Header */}
                                <div 
                                  className={`up-playlist-topic-header ${isExpanded ? 'is-expanded' : ''}`}
                                  onClick={() => handleTopicClick(topic)}
                                >
                                    <h4 className="up-playlist-topic-title">
                                        <TopicIcon className="topic-icon" />
                                        {topic}
                                    </h4>
                                    <span className="topic-item-count">
                                        ({items.length} items) <ToggleIcon className="toggle-icon" />
                                    </span>
                                </div>

                              {/* Conditional Card Content */}
                                {isExpanded && (
                                    <div className="up-content-grid-inner">
                                        {items.map(item => {
                                            const code = item.code_detail || {};
                                            return (
                                                <div
                                                  key={item.id}
                                                  className="up-playlist-card up-card-style"
                                                  onClick={() => navigate(`/Components/${code.topic_id}/${code.id}`)}
                                                >
                                                    <iframe
                                                      srcDoc={buildIframeDoc(code.html_code, code.css_code, code.js_code, 320, 450)}
                                                      sandbox="allow-scripts"
                                                      title={code.title || "Preview"}
                                                      className="up-card-iframe"
                                                    />
                                                    <div className="up-playlist-card-title">▶ {code.title || "Untitled"}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }


      // Default return for other tabs
        return <p>No content found for the **{activeTab}** tab.</p>;
    };



    // -----------------------------------------------------
    // ******************** Main Render ********************
    // -----------------------------------------------------
    if (loading || (!profile && !favorites.length)) { 
        return (
            <div className="up-profile-container">
                {/* ... Skeleton Loader Code ... */}
                <p>Loading user data...</p>
            </div>
        );
    }
    if (error) return <p>Error: {JSON.stringify(error)}</p>;


    return (
        <div className="up-profile-container">
          {/* Header (Unchanged) */}
            <header className="up-profile-header">
                <div className="up-profile-avatar-wrapper">
                    <img
                      src={profile.avatar_url || CodeVora_Logo}
                      alt={`${profile.username}'s Avatar`}
                      className="up-profile-avatar"
                    />
                </div>
                <div className="up-profile-info-main">
                    <div className="up-name-email">
                        <h1 className="up-profile-username">{profile.username}</h1>
                        <p>{profile.email}</p>
                    </div>
                    <div className="up-profile-btn-grp">
                        <button className="up-profile-edit-btn" onClick={onEditClick}><FaUserEdit /> Edit Profile</button>
                        <button className="up-profile-logout-btn" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
                    </div>
                </div>
            </header>


          {/* Tabs */}
            <section className="up-profile-content-section">
                <div className="up-profile-tab-bar">
                    {contentTabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                              key={tab.name}
                              className={`up-profile-tab-button ${activeTab === tab.name ? "active" : ""}`}
                              onClick={() => setActiveTab(tab.name)}
                            >
                                <Icon className="up-tab-icon" />
                                <span className="up-tab-label">{tab.name}</span>
                            </button>
                        );
                    })}
                </div>

              {/* Tab Content Wrapper */}
                <h3 className="up-tab-content-heading">{activeTab} Content</h3>
                <div className="up-content-grid">
                    {renderContent()}
                </div>
            </section>
        </div>
    );
}