import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../config/apiClient";
import "../assets/css/User_Login.css"; // reuse login CSS

export default function User_Signup() {
const [form, setForm] = useState({
username: "",
email: "",
password: "",
confirmPassword: "",
});

const [message, setMessage] = useState("");
const navigate = useNavigate();

const handleSubmit = async (e) => {
e.preventDefault();
setMessage("");

if (form.password !== form.confirmPassword) {
  setMessage("Passwords do not match");
  return;
}

try {
  const res = await apiClient.post("/api/user-register/", {
    username: form.username,
    email: form.email,
    password: form.password,
  });

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

    <input
      type="password"
      placeholder="Confirm Password"
      value={form.confirmPassword}
      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
      required
    />

    <button type="submit">Sign Up</button>
  </form>

  {message && <p className="error-message">{message}</p>}

  <p>
    Already have an account? <Link to="/User/Login">Login</Link>
  </p>
</div>


);
}