import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdmin } from "./Admin_API_Context";
import "../assets/css/Admin_Login.css";

export default function Admin_Login() {
  const navigate = useNavigate();
  const { login, admin, loading } = useAdmin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (admin) navigate("/Admin"); // dashboard route
  }, [admin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password); // backend sets HttpOnly cookies
      // navigation happens via useEffect
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Login failed. Check credentials.");
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

          <button type="submit" disabled={loading}>
            {loading ? (
              <>
                Logging in
                <span className="loader"></span>
              </>
            ) : (
              "Login"
            )}
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
