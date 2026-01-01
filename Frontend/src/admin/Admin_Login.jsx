import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdmin } from "./Admin_API_Context";
import { fetchAdminCsrfToken } from "../config/apiAdmin";
import "./assets/css/Admin_Login.css";

export default function Admin_Login() {
  const navigate = useNavigate();
  const { login, admin } = useAdmin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginProcessing, setLoginProcessing] = useState(false)


  // Fetch CSRF immediately on page load
  useEffect(() => {
    (async () => {
      await fetchAdminCsrfToken();
    })();
  }, []);

  // Redirect if logged in
  useEffect(() => {
    if (admin) navigate("/Admin");
  }, [admin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoginProcessing(true)
      await login(email, password); // login() uses apiAdmin which sends CSRF
      // redirect handled by useEffect when admin updates
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.detail || "Login failed. Check credentials.");
    } finally {
      setLoginProcessing(false)
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={loginProcessing}>
              {loginProcessing ? "Logging In ..." : "Login" }
          </button>

          <p>
            <b>Mail for Joining our Team</b> &nbsp;{" "}
            <Link to="/Contact">Mail</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
