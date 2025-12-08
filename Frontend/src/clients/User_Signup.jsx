import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../config/apiClient";
import "../assets/css/User_Login.css";
import "../assets/css/User_Signup.css"

export default function User_Signup() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1 = signup form, 2 = OTP verification
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); 
    const [btnProcessing, setBtnProcessing] = useState(false);
    const [btnVerifyProcessing, setBtnVerifyProcessing] = useState(false);
    const [btnResendProcessing, setBtnResendProcessing] = useState(false);


    // ============================================================
    // Submit signup form → send OTP
    // ============================================================
    const handleSignup = async (e) => {
        setBtnProcessing(true)
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setMessage("Passwords do not match");
            setMessageType("error"); // mark as error
            return;
        }
        try {
            // Send OTP request instead of final registration
            await apiClient.post("/api/email-otp/send/", { email: form.email });
            setStep(2);
            setMessage("OTP sent to your email. Please enter OTP to complete signup.");
            setMessageType("success"); // mark as success
        } catch (err) {
            setMessage("Failed to send OTP. Try again.");
            setMessageType("error"); // mark as error
        } finally {
            setBtnProcessing(false);
        }
    };



    // ============================================================
    // Verify OTP → finalize registration
    // ============================================================
    const handleVerifyOTP = async () => {
        setBtnVerifyProcessing(true)
        try {
            await apiClient.post("/api/email-otp/verify/", { email: form.email, otp });
            const res = await apiClient.post("/api/user-register/", {
                username: form.username,
                email: form.email,
                password: form.password,
            });
            if (res.status === 201) {
                setMessage("Signup completed successfully!");
                setMessageType("success"); // ✅ mark as success
                navigate("/User/Login");
            }
        } catch (err) {
            setMessage(err.response?.data?.error || "Invalid OTP or registration failed");
            setMessageType("error"); // ✅ mark as error
        } finally {
          setBtnVerifyProcessing(false)
        }
    };


    // ============================================================
    // Resend OTP
    // ============================================================
    const handleResendOTP = async () => {
        setBtnResendProcessing(true)
        try {
            await apiClient.post("/api/email-otp/send/", { email: form.email });
            setMessage("A new OTP has been sent to your email.");
            setMessageType("success"); // ✅ mark as success
        } catch (err) {
            setMessage("Failed to resend OTP. Try again.");
            setMessageType("error"); // ✅ mark as error
        } finally {
            setBtnResendProcessing(false)
        }
    };

    return (
        <div className="auth-container">
            <h2>User Signup</h2>
            {message && (
                <p className={messageType === "success" ? "success-message" : "error-message"}>
                    {message}
                </p>
            )}

          {/* STEP 1 → Signup Form */}
            {step === 1 && (
                <form onSubmit={handleSignup}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        required
                    />
                    <button type="submit" disabled={btnProcessing}>
                        {btnProcessing ? " Sending OTP... " : " Signup "}
                    </button>
                </form>
            )}

          {/* STEP 2 → OTP Verification */}
            {step === 2 && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    {/* <--------Verify and resend otp button--------> */}
                    <div className="US-otp-btn-grp">
                        <button onClick={handleVerifyOTP} disabled={btnVerifyProcessing} className="bg-success">
                            {btnVerifyProcessing ? "Verifying..." : "Verify OTP" }
                        </button>
                        <button onClick={handleResendOTP} disabled={btnResendProcessing} className="bg-danger">
                            {btnResendProcessing ? "Resending..." : "Resend OTP" }
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}