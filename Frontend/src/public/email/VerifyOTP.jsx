// src/components/VerifyOTP.jsx
import React, { useState } from "react";
import apiClient from "../config/apiClient";

export default function VerifyOTP({ email, onVerified }) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleVerifyOTP = async () => {
    try {
      const res = await apiClient.post("api/email-otp/verify/", { email, otp });
      if (res.status === 200) {
        setMessage("OTP verified!");
        if (onVerified) onVerified(); // Move to next step in signup
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "OTP verification failed");
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerifyOTP}>Verify OTP</button>
      {message && <p>{message}</p>}
    </div>
  );
}
