import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../config/apiClient";
import { fetchClientCsrfToken } from "../config/apiClient";

export default function User_Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchClientCsrfToken(); // fetch CSRF once on page load
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await apiClient.post("/api/user-login/", {
        identifier,
        password,
      });

      if (res.status === 200) {
        // No need to store tokens
        navigate("/User/Profile");
      }
    } catch (err) {
      console.error(err);
      setMessage("Login failed");
    }
  };


  return (
    <div className="auth-container">
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

      <p>
        Don't have an account? <Link to="/User/Signup">Sign Up</Link>
      </p>

      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}
