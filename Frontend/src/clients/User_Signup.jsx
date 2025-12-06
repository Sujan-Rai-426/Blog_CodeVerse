import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../config/apiClient";

export default function User_Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await apiClient.post("/api/user-register/", form);

      if (res.status === 201) {
        navigate("/User/Login");
      }
    } catch (err) {
      setMessage("Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>User Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button type="submit">Sign Up</button>
      </form>

      {message && <p style={{ color: "red" }}>{message}</p>}

      <p>Already have an account? <Link to="/User/Login">Login</Link></p>
    </div>
  );
}
