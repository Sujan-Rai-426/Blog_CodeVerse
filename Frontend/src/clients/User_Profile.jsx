// pages/User_Profile.jsx
import React, { useState, useEffect } from "react";
import { TokenService } from "../utils/token";

export default function User_Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    TokenService.logoutUser();
    window.location.href = "/User/Login";
  };

  useEffect(() => {
    const token = TokenService.getUserAccess();
    if (!token) {
      setLoading(false);
      return;
    }

    const backend = import.meta.env.DEV
      ? "http://127.0.0.1:8000"
      : "https://codevora-backend.vercel.app";

    fetch(`${backend}/api/current-user/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch(() => {
        setUserData(null);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (!userData)
    return (
      <div>
        <h2>No profile found</h2>
        <button onClick={logout}>Logout</button>
      </div>
    );

  return (
    <div>
      <h2>Your Profile</h2>
      <p><b>ID:</b> {userData.id}</p>
      <p><b>Username:</b> {userData.username}</p>
      <p><b>Email:</b> {userData.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
