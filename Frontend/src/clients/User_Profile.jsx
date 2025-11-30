import React, { useState, useEffect } from "react";
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
  const [userData, setUserData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      console.log("User not logged in");
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/User/profile/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or server error");
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        setEditData(data.profile); // Initialize edit data
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const renderContent = () => {
    if (!userData) return <p>Please login to see your profile.</p>;

    switch (activeTab) {
      case "favorites":
        return userData.favorites?.map((item) => (
          <div className="item-row" key={item.id}>
            <p>{item.title}</p>
            <button className="view-btn">View</button>
          </div>
        ));

      case "bought":
        return userData.bought?.map((item) => (
          <div className="item-row" key={item.id}>
            <div>
              <p>{item.title}</p>
              <span>{item.price}</span>
            </div>
            <button className="view-btn">View</button>
          </div>
        ));

      case "cart":
        return userData.cart?.map((item) => (
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
        return userData.history?.map((item) => (
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
              value={editData?.name || ""}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />
            <label>Email</label>
            <input
              className="settings-input"
              type="email"
              value={editData?.email || ""}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
            />
            <label>Bio</label>
            <textarea
              className="settings-input"
              rows="3"
              value={editData?.bio || ""}
              onChange={(e) =>
                setEditData({ ...editData, bio: e.target.value })
              }
            />
            <button className="save-btn">Save Changes</button>

            <hr />
            <h3>🔐 Change Password</h3>
            <input
              className="settings-input"
              type="password"
              placeholder="Old Password"
            />
            <input
              className="settings-input"
              type="password"
              placeholder="New Password"
            />
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

  if (loading) return <p>Loading profile...</p>;
  if (!userData) return <p>Please login to view your profile.</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={userData.profile?.avatar} className="profile-avatar" alt="avatar" />

        <button
          className="header-settings-btn"
          onClick={() =>
            setActiveTab(activeTab === "settings" ? null : "settings")
          }
        >
          <FaCog size={22} />
        </button>

        <div className="profile-details">
          <h2>{userData.profile?.name}</h2>
          <p>{userData.profile?.email}</p>
          <span>Joined: {userData.profile?.joined}</span>
        </div>
      </div>

      <div className="tab-grid">
        <button
          className={activeTab === "favorites" ? "active" : ""}
          onClick={() => setActiveTab("favorites")}
        >
          <FaHeart className="tab-icon" />
          <span className="tab-text">Favourite</span>
        </button>

        <button
          className={activeTab === "bought" ? "active" : ""}
          onClick={() => setActiveTab("bought")}
        >
          <FaPlayCircle className="tab-icon" />
          <span className="tab-text">Bought</span>
        </button>

        <button
          className={activeTab === "cart" ? "active" : ""}
          onClick={() => setActiveTab("cart")}
        >
          <FaShoppingCart className="tab-icon" />
          <span className="tab-text">Cart</span>
        </button>

        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          <FaHistory className="tab-icon" />
          <span className="tab-text">History</span>
        </button>
      </div>

      <div className="tab-content">{renderContent()}</div>
    </div>
  );
};

export default User_Profile;
