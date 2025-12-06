import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../config/apiClient";

export default function User_Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get("/api/user-profile/");

        if (res.status === 200) {
          setProfile(res.data);
        }
      } catch (err) {
        navigate("/User/Login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await apiClient.post("/api/user-logout/");
    navigate("/User/Login");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      {profile ? (
        <div>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Full Name:</strong> {profile.full_name || "Not set"}</p>
          <p><strong>Phone:</strong> {profile.phone || "Not set"}</p>
          <p><strong>Address:</strong> {profile.address || "Not set"}</p>
          <p><strong>Joined:</strong> {new Date(profile.created_at).toDateString()}</p>

          <button onClick={handleLogout} style={{ marginTop: "20px" }}>
            Logout
          </button>
        </div>
      ) : (
        <p>No profile found</p>
      )}
    </div>
  );
}
