import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function User_Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // <-- add this

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/user-login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",   // for future HttpOnly cookies
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save client id in localStorage
        localStorage.setItem("client_id", data.client_id);

        // Navigate to profile page
        navigate(`/User/Profile/`); // <-- redirect after login
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div className="user-login-container">
      <h2>User Login</h2>

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

        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
