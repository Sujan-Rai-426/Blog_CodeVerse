import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient, { fetchClientCsrfToken } from "../config/apiClient";
import "../assets/css/User_Login.css";

export default function User_Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1 = login, 2 = forgot OTP
  const [isForgot, setIsForgot] = useState(false);
  const [btnProcessing, setBtnProcessing] = useState(false);
  const [form, setForm] = useState({ identifier: "", password: "", newPassword: "", confirmPassword: "" });
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // ------------------ Initialize CSRF ------------------
  useEffect(() => {
    const loadCSRF = async () => {
      try {
        await fetchClientCsrfToken();
      } catch {
        setMessage("CSRF init failed");
      } finally {
        setLoading(false);
      }
    };
    loadCSRF();
  }, []);

  // ------------------ LOGIN / FORGOT PASSWORD ------------------
  const handleLoginOrForgot = async (e) => {
    e?.preventDefault();
    setBtnProcessing(true);
    setMessage("");

    try {
      const csrfToken = await fetchClientCsrfToken();

      if (isForgot) {
        await apiClient.post(
          "/api/email-otp/send/",
          { email: form.identifier },
          { headers: { "X-CSRFToken": csrfToken } }
        );
        setStep(2);
        setMessage("OTP sent. Enter OTP and new password.");
        setMessageType("success");
      } else {
        const res = await apiClient.post(
          "/api/user-login/",
          { identifier: form.identifier, password: form.password },
          { headers: { "X-CSRFToken": csrfToken } }
        );
        if (res.status === 200) navigate("/User/Profile");
      }
    } catch (err) {
      setMessage(err.response?.data?.detail || "Login / OTP failed");
      setMessageType("error");
    } finally {
      setBtnProcessing(false);
    }
  };

  // ------------------ RESET PASSWORD ------------------
  const handleResetPassword = async () => {
    if (form.newPassword !== form.confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    setBtnProcessing(true);
    setMessage("");

    try {
      const csrfToken = await fetchClientCsrfToken();

      await apiClient.post(
        "/api/password-reset/otp/",
        { email: form.identifier, otp, new_password: form.newPassword },
        { headers: { "X-CSRFToken": csrfToken } }
      );

      setMessage("Password reset successful! Please login.");
      setMessageType("success");
      setStep(1);
      setIsForgot(false);
      setForm({ identifier: form.identifier, password: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMessage(err.response?.data?.detail || "OTP or reset failed");
      setMessageType("error");
    } finally {
      setBtnProcessing(false);
    }
  };

  // ------------------ RENDER ------------------
  return (
    <div className="auth-container">
      <h2>{isForgot ? "Reset Password" : "User Login"}</h2>

      {loading ? (
        <p>Initializing session...</p>
      ) : step === 1 ? (
        <form onSubmit={handleLoginOrForgot}>
          <input
            type="text"
            placeholder="Email"
            value={form.identifier}
            onChange={(e) => setForm({ ...form, identifier: e.target.value })}
            required
          />
          {!isForgot && (
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          )}
          <button type="submit" disabled={btnProcessing}>
            {btnProcessing ? (isForgot ? "Sending OTP..." : "Logging in...") : isForgot ? "Send OTP" : "Login"}
          </button>
        </form>
      ) : step === 2 ? (
        <div>
          <form className="ul-psw-reset-form">
            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            <input type="password" placeholder="New Password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} required />
            <input type="password" placeholder="Confirm New Password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
          </form>
          <button onClick={handleResetPassword} disabled={btnProcessing}>
            {btnProcessing ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      ) : null}

      <p onClick={() => setIsForgot(!isForgot)} className="forgot-toggle">
        {isForgot ? "Back to login" : "Forgot Password?"}
      </p>

      {!isForgot && (
        <p>
          Don't have an account? <Link to="/User/Signup">Signup</Link>
        </p>
      )}

      {message && (
        <p className={messageType === "success" ? "success-message" : "error-message"}>{message}</p>
      )}
    </div>
  );
}
