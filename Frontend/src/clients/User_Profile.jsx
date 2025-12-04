import React, { useEffect, useState } from "react";

export default function User_Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const clientId = localStorage.getItem("client_id");

  useEffect(() => {
    if (!clientId) {
      console.error("No client ID found");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/user-profile/${clientId}/`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok) {
          setProfile(data);
        } else {
          console.error("Error fetching profile:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [clientId]);

  const handleLogout = async () => {
    localStorage.removeItem("client_id");

    try {
      await fetch("http://127.0.0.1:8000/api/user-logout/", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.warn("Logout API failed", err);
    }

    window.location.href = "/User/Login/";
  };

  if (loading) return <p style={{ color: "white" }}>Loading...</p>;

  return (
    <div
      className="user-profile-container"
      style={{ minHeight: "100vh", background: "red", color: "white", padding: "20px" }}
    >
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
        <p>No profile found.</p>
      )}
    </div>
  );
}
