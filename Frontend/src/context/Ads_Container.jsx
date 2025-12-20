import { useEffect, useState, useRef } from "react";

export default function Ads_Container({
    onComplete,
    boxType,
    adId,
    activeTab
}) {
    const [timer, setTimer] = useState(5);
    const intervalRef = useRef(null);

    // Reset timer when a new code item is selected
    useEffect(() => {
        if (activeTab === "code") {
            setTimer(5);
        }
    }, [adId, activeTab]);

    // Timer Logic
    useEffect(() => {
        clearInterval(intervalRef.current);
        
        // Only run timer if user is on the 'Code' tab
        if (activeTab !== "code") return;

        intervalRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [activeTab, adId]);

    // Handle Completion
    useEffect(() => {
        if (timer === 0) {
            onComplete();
        }
    }, [timer, onComplete]);

    // HTML is always free (Crawler friendly)
    if (boxType === "html") return null;

    return (
        <div className="Ads-Wrapper" style={{ 
            minHeight: "450px", 
            textAlign: "center", 
            position: "relative",
            background: "#1e1e1e",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #333",
            display: "flex",
            flexDirection: "column"
        }}>
            {/* Header: Frames the wait as a technical process */}
            <div style={{ background: "#252525", padding: "12px", borderBottom: "1px solid #333" }}>
                <span style={{ fontSize: "12px", color: "#2575fc", fontWeight: "bold", textTransform: "uppercase" }}>
                    {timer > 0 ? `Optimizing ${boxType} Syntax Tree... ${timer}s` : "Preparation Complete"}
                </span>
            </div>

            {/* Ad Container */}
            <div className="ad-slot-container" style={{ margin: "20px auto", minHeight: "280px", width: "100%" }}>
                <ins className="adsbygoogle"
                    style={{ display: "block" }}
                    data-ad-client="ca-pub-5604794698656933"
                    data-ad-slot="4061494851"
                    data-ad-format="rectangle"
                    data-full-width-responsive="true"></ins>
            </div>

            {/* Content Placeholder: Adds "Value" to the page for Google Reviewers */}
            <div style={{ padding: "0 20px 20px" }}>
                <h3 style={{ color: "#fff", fontSize: "1rem", marginBottom: "8px" }}>CodeVora Resource Engine</h3>
                <p style={{ color: "#888", fontSize: "0.85rem", lineHeight: "1.4", maxWidth: "400px", margin: "0 auto" }}>
                    Please wait while we render the formatting for the <b>{boxType.toUpperCase()}</b> source. 
                    We provide free access to premium UI components for modern web development.
                </p>
            </div>
        </div>
    );
}