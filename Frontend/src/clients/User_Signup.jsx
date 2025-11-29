import React from "react";
import "../assets/css/User_Signup.css";
import { Link } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa";


function User_Signup() {
  return (
    <div className="signup-container">
      <div className="signup-card">
          <h2>Create Your Account</h2>
          <p className="subtitle">Choose a login method</p>

          <div className="social-login">
              <button className="social-btn google">
                  <FaGoogle className="icon" /> &nbsp; Continue with Google
              </button>

              <button className="social-btn facebook">
                  <FaFacebookF className="icon" /> &nbsp; Continue with Facebook
              </button>

              <button className="social-btn github">
                  <FaGithub className="icon" /> &nbsp; Continue with GitHub
              </button>
          </div>
          <br />
          <p className="subtitle"><b>Already have an account?</b> &nbsp; <Link to="/User/Login"> Login </Link></p>
      </div>
    </div>
  );
}

export default User_Signup;
