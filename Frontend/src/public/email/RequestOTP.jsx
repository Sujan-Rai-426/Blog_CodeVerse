// src/components/RequestOTP.jsx
import React, { useState } from "react";
import apiClient from "../config/apiClient";

export default function RequestOTP() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleRequestOTP = async () => {
        try {
            const res = await apiClient.post("/api/request-otp/", { email });
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.error || "Failed to send OTP");
        }
    };

    return (
        <div>
            <h2>Request Email OTP</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={handleRequestOTP}>Send OTP</button>
            {message && <p>{message}</p>}
        </div>
    );
}
