import React, { useState } from "react";
import "../assets/css/User_Profile.css";
import {
    FaHeart,
    FaShoppingCart,
    FaHistory,
    FaCog,
    FaPlayCircle,
    FaTrash,
} from "react-icons/fa";

const User_Profile = () => {
    const [activeTab, setActiveTab] = useState("favorites");

    // DEMO: all user data in single object
    const [userData, setUserData] = useState({
        userId: 101,
        profile: {
            name: "Sujan Rai",
            email: "sujan@example.com",
            bio: "Full Stack Developer | Codevora Creator",
            avatar: "https://scontent.fbir2-1.fna.fbcdn.net/v/t39.30808-1/578026329_122095438437120223_7138633905277938491_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=106&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=z8qPCaHGsg0Q7kNvwEJjQFR&_nc_oc=Admm7v5Uxy4UIBiJWOGU-jjUsJna2rVMW-VinH5qi0IfPe19aPKc5o12mUo6dPnwaY4&_nc_zt=24&_nc_ht=scontent.fbir2-1.fna&_nc_gid=u07dOH08bNeDqNNIwpVehA&oh=00_Afh1J0jAZw46VDXBjza5XtaYUgOKJdJlImkzlFPdHJskjQ&oe=6923C417",
            joined: "2024-01-10",
        },
        favorites: [
            { id: 1, title: "React Advanced Components", date: "2024-11-01" },
            { id: 2, title: "Django REST Framework Mastery", date: "2024-10-21" },
        ],
        bought: [
            { id: 1, title: "Full Stack E-commerce Course", price: "NPR 120" },
            { id: 2, title: "Python Automation Course", price: "NPR 90" },
        ],
        cart: [
            { id: 1, title: "UI Animation Pack", price: "NPR 40" },
            { id: 2, title: "Premium Template", price: "NPR 60" },
        ],
        history: [
            { id: 1, action: "Bought Template", date: "2024-06-19" },
            { id: 2, action: "Viewed Course", date: "2024-07-10" },
        ],
    });

    const [editData, setEditData] = useState(userData.profile);

    const renderContent = () => {
        switch (activeTab) {
            case "favorites":
                return userData.favorites.map((item) => (
                    <div className="item-row" key={item.id}>
                        <p>{item.title}</p>
                        <button className="view-btn">View</button>
                    </div>
                ));

            case "bought":
                return userData.bought.map((item) => (
                    <div className="item-row" key={item.id}>
                        <div>
                            <p>{item.title}</p>
                            <span>{item.price}</span>
                        </div>
                        <button className="view-btn">View</button>
                    </div>
                ));

            case "cart":
                return userData.cart.map((item) => (
                    <div className="cart-row" key={item.id}>
                        <p>{item.title}</p>
                        <div className="cart-actions">
                            <button className="buy-btn">Buy</button>
                            <button className="delete-btn-small">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ));

            case "history":
                return userData.history.map((item) => (
                    <div className="item-row" key={item.id}>
                        <p>{item.action}</p>
                        <span>{item.date}</span>
                    </div>
                ));

            case "settings":
                return (
                    <div className="settings-container">
                        <h3>⚙️ Edit Profile</h3>
                        <label>Name</label>
                        <input
                            className="settings-input"
                            value={editData.name}
                            onChange={(e) =>
                                setEditData({ ...editData, name: e.target.value })
                            }
                        />

                        <label>Email</label>
                        <input
                            className="settings-input"
                            type="email"
                            value={editData.email}
                            onChange={(e) =>
                                setEditData({ ...editData, email: e.target.value })
                            }
                        />

                        <label>Bio</label>
                        <textarea
                            className="settings-input"
                            rows="3"
                            value={editData.bio}
                            onChange={(e) =>
                                setEditData({ ...editData, bio: e.target.value })
                            }
                        />

                        <button className="save-btn">Save Changes</button>

                        <hr />
                        <h3>🔐 Change Password</h3>
                        <input className="settings-input" type="password" placeholder="Old Password" />
                        <input className="settings-input" type="password" placeholder="New Password" />
                        <button className="save-btn">Update Password</button>

                        <hr />
                        <div className="danger-zone">
                            <h3>⚠️ Danger Zone</h3>
                            <button className="delete-btn">Delete Account</button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img src={userData.profile.avatar} className="profile-avatar" />

                {/* Settings toggle */}
                <button
                    className="header-settings-btn"
                    onClick={() =>
                        setActiveTab(activeTab === "settings" ? null : "settings")
                    }
                >
                    <FaCog size={22} />
                </button>

                <div className="profile-details">
                    <h2>{userData.profile.name}</h2>
                    <p>{userData.profile.email}</p>
                    <span>Joined: {userData.profile.joined}</span>
                </div>
            </div>

            {/* TABS */}
            <div className="tab-grid">
                <button className={activeTab === "favorites" ? "active" : ""} onClick={() => setActiveTab("favorites")}>
                    <FaHeart className="tab-icon" />
                    <span className="tab-text">Favourite</span>
                </button>

                <button className={activeTab === "bought" ? "active" : ""} onClick={() => setActiveTab("bought")}>
                    <FaPlayCircle className="tab-icon" />
                    <span className="tab-text">Bought</span>
                </button>

                <button className={activeTab === "cart" ? "active" : ""} onClick={() => setActiveTab("cart")}>
                    <FaShoppingCart className="tab-icon" />
                    <span className="tab-text">Cart</span>
                </button>

                <button className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>
                    <FaHistory className="tab-icon" />
                    <span className="tab-text">History</span>
                </button>
            </div>

            <div className="tab-content">{renderContent()}</div>
        </div>
    );
};

export default User_Profile;
