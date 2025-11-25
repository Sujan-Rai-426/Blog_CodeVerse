// src/components/Admin_Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // axios instance
import "../assets/css/Admin_Login.css";

function Admin_Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        setError("");

        try {
        // Updated backend URL
        const response = await api.post("/api/admin-login/", {
            username,
            password,
        });

        if (response.status === 200) {
            const { access_token, refresh_token } = response.data;

            // Store tokens in localStorage
            localStorage.setItem("adminToken", access_token);
            localStorage.setItem("refreshToken", refresh_token);
            localStorage.setItem("loggedIn", "true");

            // Redirect to Admin Dashboard
            navigate("/Admin");
        } else {
            setError("Invalid credentials or not an admin.");
        }
        } catch (err) {
            console.error("Login error:", err);
            setError("Invalid credentials or not an admin.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="admin-login d-flex justify-content-center align-items-center vh-100">
        <form
            onSubmit={handleLogin}
            className="p-4 shadow rounded bg-white"
            style={{ width: "350px" }}
        >
            <h3 className="text-center mb-4 text-primary">Admin Login</h3>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isUploading}
            />
            <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isUploading}
            />

            {error && <div className="alert alert-danger">{error}</div>}

            <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isUploading}
            >
                {isUploading ? "Logging In..." : "Login"}
            </button>
            <p className="mt-3">Mail here to join our team 
            &nbsp; <a href="https://sujan140.vercel.app/contact/">Mail</a>
            </p>
        </form>
        </div>
    );
}

export default Admin_Login;
