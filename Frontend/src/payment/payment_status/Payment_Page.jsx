import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Esewa_Payment from "../esewa/Esewa_Payment.jsx";
import Bank_Payment from "../bank/Bank_Payment.jsx";

const Payment_Page = ({ unlockVideo, videoId, amount }) => {
    const [isPaying, setIsPaying] = useState(true); 
    const [activeMethod, setActiveMethod] = useState("esewa"); // default active method
    const navigate = useNavigate(); 

    const handleCancel = () => navigate(-1);

    return (
        <div className="payment-page-container">
            {/* Background content */}
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
                        <p>Choose a payment method below to continue.</p>
                    </section>
                </main>
            </div>

            {/* Payment Overlay */}
            {isPaying && (
                <div className="payment-overlay">
                    <div className="payment-box">
                        <h3>💳 Complete Your Payment</h3>
                        <p>Select a payment method:</p>

                        {/* Toggle Logos */}
                        <div className="payment-toggle-logos">
                            <img
                                src="https://rpcdn.ratopati.com/media/albums/eSewa-Company-Logo_FWu1YucLO0.jpg"
                                alt="Esewa"
                                className={activeMethod === "esewa" ? "active" : ""}
                                onClick={() => setActiveMethod("esewa")}
                            />
                            <img
                                src="https://substackcdn.com/image/fetch/$s_!m1M8!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd4c8f63d-3bce-4bf8-b958-f10fd43e07df_800x500.png"
                                alt="Bank"
                                className={activeMethod === "bank" ? "active" : ""}
                                onClick={() => setActiveMethod("bank")}
                            />
                        </div>

                        {/* Payment Form */}
                        <div className="payment-method-form">
                            {activeMethod === "esewa" && (
                                <Esewa_Payment videoId={videoId} amount={amount} unlockVideo={unlockVideo} />
                            )}
                            {activeMethod === "bank" && (
                                <Bank_Payment videoId={videoId} amount={amount} unlockVideo={unlockVideo} />
                            )}
                        </div>

                        {/* Cancel */}
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
