// src/pages/User_Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAPI } from "./User_API_Context";
import apiClient from "../config/apiClient";

import "./assets/css/User_Profile.css";
import "../public/designs/assets/css/Components_Design.css";
import CodeVora_Logo from "../assets/img/About_img/CodeVora.png";

import { 
    FaUserEdit, FaSignOutAlt, FaHeart, FaShoppingBag, FaList, FaHistory, 
    FaAngleRight, FaAngleDown, FaFolderOpen 
} from "react-icons/fa";

const AVATAR_BASE_URL = import.meta.env.VITE_AVATAR_BASE_URL;

export default function User_Profile() {
    const navigate = useNavigate();

    const {
        profile,
        favorites,
        profileLoading,
        favoritesLoading,
        loadFavorites,
        error
    } = useUserAPI();

    const [activeTab, setActiveTab] = useState("Favourite");
    const [expandedTopic, setExpandedTopic] = useState(null);
    const [avatarSeed, setAvatarSeed] = useState("");

    // ----------------- Sync avatar AFTER profile loads -----------------
    useEffect(() => {
        if (profile?.avatar_seed) {
            setAvatarSeed(profile.avatar_seed);
        }
    }, [profile]);

    // ----------------- Lazy load favourites -----------------
    useEffect(() => {
        if (activeTab === "Favourite" || activeTab === "Play List") {
            loadFavorites();
        }
    }, [activeTab, loadFavorites]);

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

    const groupedFavoritesAsPlaylists = groupFavoritesByTopic(favorites || []);

    // ----------------- Build iframe preview -----------------
    const buildIframeDoc = (html = "", css = "", js = "", w = 320, h = 450) => {
        const safeJs = (js || "").replace(/<\/script>/gi, "<\\/script>");
        return `
        <!doctype html>
        <html>
        <head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <style>
                html, body {
                    margin:0; padding:0; width:100%; height:100%;
                    display:flex; justify-content:center; align-items:center;
                    background:transparent; overflow:hidden;
                }
                .scaleWrapper {
                    width:100%; 
                    height:100%;
                    display:flex; 
                    flex-direction: column;
                    justify-content:center; 
                    align-items:center;
                }
                .scaleInner {
                    width:${w}px;
                    height:${h}px;
                    transform-origin:center center;
                    display:flex; 
                    flex-direction: column;
                    justify-content:center; 
                    align-items:center;
                }
                ${css || ""}
            </style>
        </head>
        <body>
            <div class="scaleWrapper">
                <div class="scaleInner" id="scaleInner">${html || ""}</div>
            </div>
            <script>
                try { ${safeJs} } catch(e){}
                function resize(){
                    const s = Math.min(
                        window.innerWidth / ${w},
                        window.innerHeight / ${h}
                    );
                    document.getElementById("scaleInner").style.transform =
                        'scale(' + s + ')';
                }
                window.addEventListener('resize', resize);
                resize();
            </script>
        </body>
        </html>
        `;
    };

    // ----------------- Skeleton -----------------
    if (profileLoading) {
        return (
            <div className="up-profile-container up-skeleton">
                <div className="up-skeleton-header">
                    <div className="up-skeleton-avatar shimmer"></div>
                    <div className="up-skeleton-info">
                        <div className="up-skeleton-line lg shimmer"></div>
                        <div className="up-skeleton-line md shimmer"></div>
                        <div className="up-skeleton-btns">
                            <div className="up-skeleton-btn shimmer"></div>
                            <div className="up-skeleton-btn shimmer"></div>
                        </div>
                    </div>
                </div>

                <div className="up-skeleton-tabs">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="up-skeleton-tab shimmer"></div>
                    ))}
                </div>

                <div className="up-content-grid">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="up-skeleton-card shimmer">
                            <div className="up-skeleton-iframe shimmer"></div>
                            <div className="up-skeleton-line sm shimmer"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ----------------- HARD GUARD -----------------
    if (!profile) return null;

    if (error) {
        return <p>Error: {JSON.stringify(error)}</p>;
    }

    // ----------------- Render Content -----------------
    const renderContent = () => {

        if (activeTab === "Favourite") {
            if (favoritesLoading) return <p>Loading favourites...</p>;
            if (!favorites || favorites.length === 0) {
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
                            srcDoc={buildIframeDoc(code.html_code, code.css_code, code.js_code)}
                            sandbox="allow-scripts allow-forms allow-modals"
                            title={code.title || "Preview"}
                            className="up-card-iframe"
                        />
                        <div className="up-card-title-text">
                            &nbsp; ▶ &nbsp; {code.title || "Untitled"}
                        </div>
                    </div>
                );
            });
        }

        if (activeTab === "Play List") {
            if (favoritesLoading) return <p>Loading playlist...</p>;
            if (!favorites || favorites.length === 0) {
                return <p>No items found in your Favourites to create a Play List.</p>;
            }

            const topics = Object.keys(groupedFavoritesAsPlaylists);

            return (
                <div className="up-playlist-wrapper" style={{ gridColumn: "1 / -1", width: "100%" }}>
                    {topics.map(topic => {
                        const isExpanded = expandedTopic === topic;
                        const items = groupedFavoritesAsPlaylists[topic];
                        const ToggleIcon = isExpanded ? FaAngleDown : FaAngleRight;
                        const TopicIcon = isExpanded ? FaFolderOpen : FaList;

                        return (
                            <div key={topic} className="up-playlist-topic-container">
                                <div
                                    className={`up-playlist-topic-header ${isExpanded ? "is-expanded" : ""}`}
                                    onClick={() =>
                                        setExpandedTopic(isExpanded ? null : topic)
                                    }
                                >
                                    <h4 className="up-playlist-topic-title">
                                        <TopicIcon className="topic-icon" />
                                        {topic}
                                    </h4>
                                    <span className="topic-item-count">
                                        ({items.length} items) <ToggleIcon className="toggle-icon" />
                                    </span>
                                </div>

                                {isExpanded && (
                                    <div className="up-content-grid-inner">
                                        {items.map(item => {
                                            const code = item.code_detail || {};
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="up-playlist-card up-card-style"
                                                    onClick={() =>
                                                        navigate(`/Components/${code.topic_id}/${code.id}`)
                                                    }
                                                >
                                                    <iframe
                                                        srcDoc={buildIframeDoc(code.html_code, code.css_code, code.js_code)}
                                                        sandbox="allow-scripts"
                                                        title={code.title || "Preview"}
                                                        className="up-card-iframe"
                                                    />
                                                    <div className="up-playlist-card-title">
                                                        ▶ {code.title || "Untitled"}
                                                    </div>
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

        return <p>No content found for the Transaction {activeTab}.</p>;
    };

    // ----------------- MAIN RENDER -----------------
    return (
        <div className="up-profile-container">

            <header className="up-profile-header">
                <div className="up-profile-avatar-wrapper">
                    <img
                        src={avatarSeed ? `${AVATAR_BASE_URL}?seed=${avatarSeed}` : CodeVora_Logo}
                        alt={`${profile.username}'s Avatar`}
                        className="up-profile-avatar"
                    />
                </div>

                <div className="up-profile-info-main">
                    <div className="up-name-email">
                        <h1 className="up-profile-username">{profile.username}</h1>
                        <p className="text-secondary">
                            <small>{profile.email}</small>
                        </p>
                    </div>

                    <div className="up-profile-btn-grp">
                        <button
                            className="up-profile-edit-btn"
                            onClick={() => navigate("/User/Edit-Profile")}
                        >
                            <FaUserEdit /> Edit Profile
                        </button>

                        <button
                            className="up-profile-logout-btn"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <section className="up-profile-content-section">
                <div className="up-profile-tab-bar">
                    {[
                        { name: "Favourite", icon: FaHeart },
                        { name: "Purchased", icon: FaShoppingBag },
                        { name: "Play List", icon: FaList },
                        { name: "History", icon: FaHistory }
                    ].map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.name}
                                className={`up-profile-tab-button ${
                                    activeTab === tab.name ? "active" : ""
                                }`}
                                onClick={() => setActiveTab(tab.name)}
                            >
                                <Icon className="up-tab-icon" />
                                <span className="up-tab-label">{tab.name}</span>
                            </button>
                        );
                    })}
                </div>

                <h3 className="up-tab-content-heading">{activeTab} Content</h3>

                <div className="up-content-grid">
                    {renderContent()}
                </div>
            </section>
        </div>
    );
}
