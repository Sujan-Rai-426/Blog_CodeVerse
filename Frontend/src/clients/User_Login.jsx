// pages/User_Login.jsx
import React, { useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { TokenService } from "../utils/token";

function User_Login() {
    const navigate = useNavigate();

    // Handle redirect after OAuth login
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const access = urlParams.get("access_token");
        const refresh = urlParams.get("refresh_token");

        if (access && refresh) {
            // Save tokens using TokenService
            TokenService.saveUserTokens(access, refresh);

            // Redirect to profile/dashboard
            navigate("/User/Profile", { replace: true });
        }
    }, [navigate]);

const handleGithubLogin = () => {
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
