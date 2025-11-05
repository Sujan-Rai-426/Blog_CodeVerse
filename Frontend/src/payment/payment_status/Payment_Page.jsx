import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // import navigate
import Esewa_Payment from "../esewa/Esewa_Payment.jsx";
import Bank_Payment from "../bank/Bank_Payment.jsx";
import '../../assets/css/Payment_Page.css';

/**
 * Payment_Page Component
 * Shows a floating payment overlay for premium videos.
 * Users can choose payment method or cancel.
 */
const Payment_Page = ({ unlockVideo, videoId, amount }) => {
    const [isPaying, setIsPaying] = useState(true); // track if overlay is visible
    const navigate = useNavigate(); // react-router navigation

    // === Cancel Payment Overlay ===
    const handleCancel = () => {
        navigate(-1); // Go back in browser history
    };


    return (
        <div className="payment-page-container">
            {/* === Background content === */}
            <div className={`background-content ${isPaying ? "blurred-background" : ""}`}>
                <header className="page-header">
                    <h1>🎬 CodeVerse Tutorials</h1> {/* page title */}
                </header>

                <main className="page-main">
                    {/* === Video Preview Section === */}
                    <section className="video-preview">
                        <video
                            src="/path-to-sample-video.mp4"
                            controls
                            muted
                            loop
                            className="sample-video"
                        ></video>
                    </section>

                    {/* === Page Info Section === */}
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

                        {/* === Payment Methods Section === */}
                        <div className="payment-methods">
                            <div className="payment-card">
                                <img src="/path-to-esewa-logo.png" alt="Esewa" /> {/* logo */}
                                <span>ESEWA</span> {/* label */}
                                <Esewa_Payment videoId={videoId} amount={amount} unlockVideo={unlockVideo} /> {/* Esewa component */}
                            </div>

                            <div className="payment-card">
                                <img src="/path-to-bank-logo.png" alt="Bank" /> {/* logo */}
                                <span>BANK</span> {/* label */}
                                <Bank_Payment videoId={videoId} amount={amount} unlockVideo={unlockVideo} /> {/* Bank component */}
                            </div>
                        </div>

                        {/* === Cancel Button === */}
                        <button className="cancel-btn" onClick={handleCancel}>
                            ❌ Cancel Payment {/* hides overlay & navigate back */}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment_Page;
