import React, { useState, useEffect } from "react";
import "../assets/css/User_Profile.css";
import { FaHeart, FaShoppingCart, FaHistory, FaCog, FaPlayCircle, FaTrash } from "react-icons/fa";

const User_Profile = () => {
    const [activeTab, setActiveTab] = useState("favorites");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        localStorage.removeItem("user_token");
        window.location.href = "/User/Login";
    };

    useEffect(() => {
        const token = localStorage.getItem("user_token");
        if (!token) {
            setLoading(false);
            return;
        }

        const backend = import.meta.env.DEV
            ? "http://127.0.0.1:8000"
            : "https://codevora-backend.vercel.app";

        fetch(`${backend}/api/User/Profile/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Unauthorized or server error");
                return res.json();
            })
            .then((data) => {
                setUserData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading profile...</p>;
    if (!userData) return <p>Please login to view your profile.</p>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img src={userData.profile?.avatar} className="profile-avatar" alt="avatar" />
                <button className="header-settings-btn" onClick={() => setActiveTab(activeTab === "settings" ? null : "settings")}>
                    <FaCog size={22} />
                </button>
                <div className="profile-details">
                    <h2>{userData.profile?.name}</h2>
                    <p>{userData.profile?.email}</p>
                    <span>Joined: {userData.profile?.joined}</span>
                </div>
            </div>

            <div className="tab-grid">
                <button className={activeTab === "favorites" ? "active" : ""} onClick={() => setActiveTab("favorites")}>
                    <FaHeart className="tab-icon" /> <span className="tab-text">Favourite</span>
                </button>
                <button className={activeTab === "bought" ? "active" : ""} onClick={() => setActiveTab("bought")}>
                    <FaPlayCircle className="tab-icon" /> <span className="tab-text">Bought</span>
                </button>
                <button className={activeTab === "cart" ? "active" : ""} onClick={() => setActiveTab("cart")}>
                    <FaShoppingCart className="tab-icon" /> <span className="tab-text">Cart</span>
                </button>
                <button className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>
                    <FaHistory className="tab-icon" /> <span className="tab-text">History</span>
                </button>
            </div>

            <div className="tab-content">
                {activeTab === "favorites" && userData.favorites?.map((item) => (
                    <div className="item-row" key={item.id}>{item.title}</div>
                ))}
                {activeTab === "bought" && userData.bought?.map((item) => (
                    <div className="item-row" key={item.id}>{item.title}</div>
                ))}
                {activeTab === "cart" && userData.cart?.map((item) => (
                    <div className="cart-row" key={item.id}>
                        <p>{item.title}</p>
                        <div className="cart-actions">
                            <button className="buy-btn">Buy</button>
                            <button className="delete-btn-small"><FaTrash /></button>
                        </div>
                    </div>
                ))}
                {activeTab === "history" && userData.history?.map((item) => (
                    <div className="item-row" key={item.id}>
                        <p>{item.action}</p>
                        <span>{item.date}</span>
                    </div>
                ))}
            </div>

            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default User_Profile;
