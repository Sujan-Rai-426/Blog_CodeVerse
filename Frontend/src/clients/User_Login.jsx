import React, { useEffect } from "react";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function User_Login() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            // Save token
            localStorage.setItem("jwt_token", token);

            // Remove token from URL
            window.history.replaceState({}, document.title, "/User/Profile/");

            // Redirect to protected route
            navigate("/User/Profile/");
        }
    }, [navigate]);

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Welcome Back</h2>
                <p className="subtitle">Continue with your Account</p>

                <div className="social-login">
                    <button
                        className="social-btn github"
                        onClick={() => {
                            window.location.href =
                                "http://127.0.0.1:8000/accounts/github/login/";
                        }}
                    >
                        <FaGithub /> &nbsp; Login with GitHub
                    </button>
                </div>

                <br />
                <p className="subtitle">
                    <b>Create a new account?</b> <Link to="/User/Signup">Signup</Link>
                </p>
            </div>
        </div>
    );
}

export default User_Login;
