import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Esewa_Payment from "../esewa/Esewa_Payment.jsx";
import Bank_Payment from "../bank/Bank_Payment.jsx";
import '../../assets/css/Payment_Page.css';

const Payment_Page = ({ unlockVideo, videoId, amount }) => {
    const [isPaying, setIsPaying] = useState(true);
    const navigate = useNavigate(); // ✅ Initialize navigation

    const handleCancel = () => {
        setIsPaying(false);
        // Navigate back to the video page
        navigate(`/Frontend_Tutorial_Solution/${videoId}`); // Adjust route according to your route setup
    };

    return (
        <div className="payment-page-container">
            {/* === Background content (blurred while payment active) === */}
            <div className={`background-content ${isPaying ? "blurred-background" : ""}`}>
                <header className="page-header">
                    <h1>🎬 CodeVerse Tutorials</h1>
                </header>

                <main className="page-main">
                    <section className="video-preview">
                        <video
                            src="/path-to-sample-video.mp4"
                            controls
                            muted
                            loop
                            className="sample-video"
                        ></video>
                    </section>

                    <section className="page-info">
                        <h2>Unlock Premium Content</h2>
                        <p>
                            You are about to unlock premium content for this tutorial. Choose a payment method below to continue.
                        </p>
                    </section>
                </main>
            </div>

            {/* === Payment Overlay === */}
            {isPaying && (
                <div className="payment-overlay">
                    <div className="payment-box">
                        <h3>💳 Complete Your Payment</h3>
                        <p>Select a payment method to unlock premium content:</p>

                        {/* === Payment Methods Side by Side === */}
                        <div className="payment-methods">
                            <div className="payment-card">
                                <img src="/path-to-esewa-logo.png" alt="Esewa" />
                                <span>ESEWA</span>
                                <Esewa_Payment videoId={videoId} amount={amount} unlockVideo={unlockVideo} />
                            </div>

                            <div className="payment-card">
                                <img src="/path-to-bank-logo.png" alt="Bank" />
                                <span>BANK</span>
                                <Bank_Payment videoId={videoId} amount={amount} unlockVideo={unlockVideo} />
                            </div>
                        </div>

                        <button className="cancel-btn" onClick={handleCancel}>
                            ❌ Cancel Payment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment_Page;
