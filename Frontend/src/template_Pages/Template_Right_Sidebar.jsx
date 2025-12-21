import React, { useContext, useState } from "react";
import "../assets/css/Template_Right_Sidebar.css";
import { 
    FaStar, 
    FaBug, 
    FaLightbulb, 
    FaComment, 
    FaUserPlus, 
    FaSignInAlt, 
    FaPaypal, 
    FaGithub, 
    FaPlay, 
    FaUser 
} from "react-icons/fa";
import User_API_Context from "../clients/User_API_Context.jsx";
import CodeVora_Logo from "../assets/img/About_img/CodeVora.png"
import { Link, useNavigate } from "react-router-dom";


// Dynamic Avatar URL Change
const AVATAR_BASE_URL = import.meta.env.VITE_AVATAR_BASE_URL



function Template_Right_Sidebar() {
    const { profile } = useContext(User_API_Context);
    const [avatarSeed, setAvatarSeed] = useState(profile?.avatar_seed || "");
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
    const handleEnterGame = async () => {
        try {
            window.open("https://escape-road-140.netlify.app/", "_blank")
        } catch {
            return
        }
    };


    // ************** handle Buy Me Coffee ***************
    const handleBuyMeCoffee = () => {
        const amount = prompt("Enter amount (USD):");
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        window.open(
            `https://www.paypal.me/SujanRai140/${amount}`,
            "_blank"
        );
    };



    return (
        <div className="right-sidebar">
        {/* ==== User Profile / Login ==== */}
            <div className="crs-sidebar-section user-profile">
                {profile ? (
                    <div className="crs-profile-info">
                    {/*****  Profile Image / Avatar *****/}
                        <img
                            src={
                                avatarSeed 
                                    ? `${AVATAR_BASE_URL}?seed=${avatarSeed}` 
                                    : CodeVora_Logo
                            }
                            alt={`${profile.username}'s Avatar`}
                            className="crs-profile-avatar"
                        />

                    {/*****  Profile Name and Email *****/}
                        <div style={{display: 'flex', flexDirection:'column', padding:'1rem 0'}}>
                            <span className="crs-profile-info">{profile.username || "User"}</span>
                            <span className="crs-profile-info text-secondary"> <small>{profile.email || "User"}</small> </span>
                        </div>

                    {/*****  Profile Enter and Logout BTN *****/}
                        <div className="profile-btn-grp">
                            <button className="crs-profile-edit-btn" onClick={handleEnterProfile} ><FaUser /> Profile </button>
                            <button className="crs-play-game-btn" onClick={handleEnterGame}><FaPlay /> Games </button>
                        </div>
                    </div>
                ) : (
                // {/*****  Profile Login/ Signup BTN *****/}
                    <div className="crs-auth-buttons">
                        <Link to="/User/Login/" className="crs-login-btn"> <FaSignInAlt /> Login</Link>
                        <Link to="/User/Signup/" className="crs-signup-btn"> <FaUserPlus /> Signup</Link>
                        <button className="crs-game-btn" onClick={handleEnterGame}> <FaPlay /> Play Games</button>
                    </div>
                )}
            </div>

        {/* ==== Quick Actions ==== */}
            {/* <div className="sidebar-section quick-actions">
                <h4>Quick Actions</h4>
                <div className="actions-list">
                    <button title="Favorite"><FaHeart /> Favorite</button>
                    <button title="Premium"><FaGem /> Premium</button>
                    <button title="Recent"><FaClock /> Recent</button>
                </div>
            </div> */}

        {/* ==== Extra Actions ==== */}
            <div className="sidebar-section extra-actions">
                <h4>Support / Feedback</h4>
                <div className="actions-list">


                    {/* Star the repo */}
                    <button 
                        title="Star" 
                        onClick={() => window.open(
                            "https://github.com/Sujan-Rai-426/CodeVora",
                            "_blank"
                        )}
                    >
                        <span className="crs-star-icon"><FaStar /></span> Give Star<FaGithub/>
                    </button>


                    {/* Buy Me a Coffee */}
                    <button 
                        title="Support via PayPal" 
                        onClick={handleBuyMeCoffee}
                    >
                        <span className="crs-BuyMeCoffee-icon"><FaPaypal /></span> Donate
                    </button>

                    {/* <button 
                        title="Buy me Coffee" 
                        onClick={() => window.open(
                            "https://www.buymeacoffee.com/sujanrai", // <-- replace with your link
                            "_blank"
                        )}
                    >
                        <FaCoffee /> Buy me Coffee
                    </button> */}


                    {/* PlayGround Code Compiler */}
                    <button 
                        title="Test Code" 
                        onClick={() => navigate("/PlayGround/Code-compiler")
                        }
                    >
                        <span className="text-info crs-reportBug-icon"><FaBug /></span> Report Bug
                    </button>


                    {/* Report Bug */}
                    <button 
                        title="Report Bug" 
                        onClick={() => window.open(
                            "https://github.com/Sujan-Rai-426/CodeVora/issues/new?labels=bug&template=bug_report.md",
                            "_blank"
                        )}
                    >
                        <span className="crs-reportBug-icon"><FaBug /></span> Report Bug
                    </button>


                    {/* Request Feature */}
                    <button 
                        title="Request Feature" 
                        onClick={() => window.open(
                            "https://github.com/Sujan-Rai-426/CodeVora/issues/new?labels=enhancement&template=feature_request.md",
                            "_blank"
                        )}
                    >
                        <span className="crs-requestFeature-icon"><FaLightbulb /></span> Request Feature
                    </button>


                    {/* Feedback: GitHub Discussions (optional) */}
                    <button 
                        title="Feedback" 
                        onClick={() => window.open(
                            "https://github.com/Sujan-Rai-426/CodeVora/issues/new?labels=feedback",
                            "_blank"
                        )}
                    >
                        <span className="crs-feedback-icon"><FaComment /></span> Feedback
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

export default Template_Right_Sidebar;
