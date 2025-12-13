import React, { useContext } from "react";
import "../assets/css/Components_Right_Sidebar.css";
import { FaHeart, FaStar, FaGem, FaClock, FaCoffee, FaBug, FaLightbulb, FaComment, FaUserEdit, FaSignOutAlt, FaUserPlus, FaSignInAlt, FaArrowRight } from "react-icons/fa";
import User_API_Context from "../clients/User_API_Context.jsx";
import CodeVora_Logo from "../assets/img/About_img/CodeVora.png"
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../config/apiClient.js";





function Components_Right_Sidebar() {
    const { profile } = useContext(User_API_Context);
    const navigate = useNavigate();
    

    // ************** handle Enter Profile ***************
    const handleEnterProfile = async () => {
        try {
            navigate("/User/Profile")
        } catch {
            return
        }
    }

    // ************** handle LogOut ***************
    const handleLogout = async () => {
        try {
            await apiClient.post("/api/user-logout/");
        } finally {
            navigate("/User/Login");
        }
    };


    return (
        <div className="right-sidebar">
        {/* ==== User Profile / Login ==== */}
            <div className="crs-sidebar-section user-profile">
                {profile ? (
                    <div className="crs-profile-info">
                    {/*****  Profile Image *****/}
                        <img
                            src={profile.avatar_url || CodeVora_Logo }
                            alt={profile.username || "User"}
                            className="crs-profile-avatar"
                        />

                    {/*****  Profile Name and Email *****/}
                        <div style={{display: 'flex', flexDirection:'column', padding:'1rem 0'}}>
                            <span className="crs-profile-info">{profile.username || "User"}</span>
                            <span className="crs-profile-info"> <small>{profile.email || "User"}</small> </span>
                        </div>

                    {/*****  Profile Enter and Logout BTN *****/}
                        <div className="profile-btn-grp">
                            <button className="crs-profile-edit-btn" onClick={handleEnterProfile} ><FaArrowRight /> Profile </button>
                            <button className="crs-profile-logout-btn" onClick={handleLogout}><FaSignOutAlt /> Logout </button>
                        </div>
                    </div>
                ) : (
                // {/*****  Profile Login/ Signup BTN *****/}
                    <div className="crs-auth-buttons">
                        <Link to="/User/Login/" className="crs-login-btn"> <FaSignInAlt /> Login</Link>
                        <Link to="/User/Signup/" className="crs-signup-btn"> <FaUserPlus /> Signup</Link>
                    </div>
                )}
            </div>

        {/* ==== Quick Actions ==== */}
            <div className="sidebar-section quick-actions">
                <h4>Quick Actions</h4>
                <div className="actions-list">
                    <button title="Favorite"><FaHeart /> Favorite</button>
                    <button title="Premium"><FaGem /> Premium</button>
                    <button title="Recent"><FaClock /> Recent</button>
                </div>
            </div>

        {/* ==== Extra Actions ==== */}
            <div className="sidebar-section extra-actions">
                <h4>Support / Feedback</h4>
                <div className="actions-list">

                    {/* Feedback: GitHub Discussions (optional) */}
                    <button 
                        title="Feedback" 
                        onClick={() => window.open(
                            "https://github.com/Sujan-Rai-426/CodeVora/discussions",
                            "_blank"
                        )}
                    >
                        <FaComment /> Feedback
                    </button>

                    {/* Star the repo */}
                    <button 
                        title="Star" 
                        onClick={() => window.open(
                            "https://github.com/Sujan-Rai-426/CodeVora",
                            "_blank"
                        )}
                    >
                        <FaStar /> Star
                    </button>

                    {/* Buy Me a Coffee */}
                    <button 
                        title="Buy me Coffee" 
                        onClick={() => window.open(
                            "https://www.buymeacoffee.com/sujanrai", // <-- replace with your link
                            "_blank"
                        )}
                    >
                        <FaCoffee /> Buy me Coffee
                    </button>

                    {/* Report Bug */}
                    <button 
                        title="Report Bug" 
                        onClick={() => window.open(
                            "https://github.com/Sujan-Rai-426/CodeVora/issues/new?labels=bug&template=bug_report.md",
                            "_blank"
                        )}
                    >
                        <FaBug /> Report Bug
                    </button>

                    {/* Request Feature */}
                    <button 
                        title="Request Feature" 
                        onClick={() => window.open(
                            "https://github.com/Sujan-Rai-426/CodeVora/issues/new?labels=enhancement&template=feature_request.md",
                            "_blank"
                        )}
                    >
                        <FaLightbulb /> Request Feature
                    </button>

                </div>
            </div>

        {/* ==== Footer ==== */}
            <div className="crs-sidebar-footer">
                <small>Powered by Sujan</small>
            </div>
        </div>
    );
}

export default Components_Right_Sidebar;
