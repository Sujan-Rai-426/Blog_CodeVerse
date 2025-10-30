import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Admin_Login.css"; // create CSS as needed

function Admin_Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "Sujan" && password === "_django_Sujan140@") {
      window.localStorage.setItem("loggedIn", "true"); // ✅ set value
      navigate("/Admin_Dashboard");
    }
    else {
      alert("Invalid credentials!");
    }
};


  return (
    <div className="admin-login d-flex justify-content-center align-items-center vh-100">
      <form
        onSubmit={handleLogin}
        className="p-4 shadow rounded bg-white"
        style={{ width: "350px" }}
      >
        <h3 className="text-center mb-4">Admin Login</h3>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
}

export default Admin_Login;
