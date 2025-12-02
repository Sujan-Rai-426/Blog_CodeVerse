// pages/User_Login.jsx
import React from "react";
import { FaGithub } from "react-icons/fa";

function User_Login() {
    const handleGithubLogin = () => {
        const token = localStorage.getItem("user_token");
        if (token) return; // Already logged in

        const backend = import.meta.env.DEV
            ? "http://127.0.0.1:8000"
            : "https://codevora-backend.vercel.app";

        window.location.href = `${backend}/accounts/github/login/`;
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Welcome Back</h2>
                <p className="subtitle">Continue with your Account</p>
                <div className="social-login">
                    <button className="social-btn github" onClick={handleGithubLogin}>
                        <FaGithub /> &nbsp; Login with GitHub
                    </button>
                </div>
            </div>
        </div>
    );
}

export default User_Login;
