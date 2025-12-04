import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function User_Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // <-- new state
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // for redirect after signup

  const handleSignup = async (e) => {
    e.preventDefault();

    // --- Check if passwords match ---
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/user-register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Account created successfully");

        // Optionally auto-login and redirect to profile
        localStorage.setItem("client_id", data.id || data.client_id); // adjust depending on your backend
        navigate("/User/Profile"); 
      } else {
        setMessage(data.error || "Signup failed");
      }
    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div className="user-signup-container">
      <h2>Create Account</h2>

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Sign Up</button>
      </form>

      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}
