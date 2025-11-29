import React from "react";
import "../assets/css/User_Login.css";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

function User_Login() {
    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Welcome Back</h2>
                <p className="subtitle"> Continue with your Account </p>

                <div className="social-login">
                    <button className="social-btn google">
                        <FaGoogle className="icon" /> &nbsp; Login with Google
                    </button>

                    <button className="social-btn facebook">
                        <FaFacebookF className="icon" /> &nbsp; Login with Facebook
                    </button>

                    <button className="social-btn github">
                        <FaGithub className="icon" /> &nbsp; Login with GitHub
                    </button>
                </div>

                    <br />
                <p className="subtitle"><b>Create a new account?</b> &nbsp; <Link to="/User/Signup"> Signup </Link></p>
            </div>
        </div>
    );
}

export default User_Login;
