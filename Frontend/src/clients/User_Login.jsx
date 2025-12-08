// src/components/User_Login.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../config/apiClient";
import { fetchClientCsrfToken } from "../config/apiClient"; // Import the async function
import "../assets/css/User_Login.css";

export default function User_Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true); // 👈 1. New loading state

  const navigate = useNavigate();

  useEffect(() => {
    // 👈 2. Wrap the CSRF fetch in an async function to wait for it
    const loadCsrfToken = async () => {
      try {
        await fetchClientCsrfToken();
      } catch (error) {
        console.error("Failed to load CSRF token:", error);
        setMessage("Error initializing the application. Please refresh.");
      } finally {
        setIsLoading(false); // 👈 3. Mark loading complete
      }
    };

    loadCsrfToken();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) { // Optional safety check
        setMessage("Initialization still in progress. Please wait.");
        return;
    }
    // ... rest of handleLogin remains the same
    try {
      const res = await apiClient.post("/api/user-login/", {
        identifier,
        password,
      });

      if (res.status === 200) {
        navigate("/User/Profile");
      }
    } catch (err) {
      console.error(err);
      setMessage("Login failed. Check credentials or server logs.");
    }
  };

  return (
    <div className="auth-container">
      <h2>User Login</h2>

      {/* 👈 4. Conditional rendering or disabling */}
      {isLoading ? (
        <p>Initializing secure session, please wait...</p>
      ) : (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Disable button while loading, though the form hiding achieves this */}
          <button type="submit" disabled={isLoading}>
            Login
          </button>
        </form>
      )}

      <p>
        Don't have an account? <Link to="/User/Signup">Sign Up</Link>
      </p>

      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}