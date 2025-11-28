import React, { useState, useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import { FaCopy } from "react-icons/fa";
import Ads_Container from "../context/Ads_Container";
import { useNavigate } from "react-router-dom";

export default function Design_Code({
    html = "",
    css = "",
    js = "",
    codeId,               // 🔹 REQUIRED
    access_type = "Free", 
    price = 100,
    hasBought = false
}) {
    if (!codeId) throw new Error("codeId prop is required for Design_Code");

    const navigate = useNavigate();

    // 🔹 Active tab
    const [activeTab, setActiveTab] = useState("html");

    // 🔹 Ad completion per tab
    const [adCompleted, setAdCompleted] = useState({
        html: true,
        css: false,
        js: false,
    });

    // 🔹 Prism highlight
    const codeRef = useRef(null);
    useEffect(() => {
        if (codeRef.current) {
            Prism.highlightElement(codeRef.current);
        }
    }, [activeTab, adCompleted]);

    // 🔹 Get code depending on tab
    const getCode = () =>
        activeTab === "html" ? html : activeTab === "css" ? css : js;

    // 🔹 Access Logic
    const isFree = access_type === "Free";
    const isPremium = access_type === "Premium";

    const freeAccessAllowed = isFree && adCompleted[activeTab];
    const premiumAccessAllowed = isPremium && hasBought;
    const canViewCode = freeAccessAllowed || premiumAccessAllowed;

    // 🔹 Copy logic
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        if (!canViewCode) return;

        const code = getCode();
        const commentStart = activeTab === "html" ? "<!-- " : activeTab === "css" ? "/* " : "// ";
        const commentEnd = activeTab === "html" ? " -->" : activeTab === "css" ? " */" : "";
        const promo = `${commentStart}Code by CodeVora — https://codevora140.vercel.app ${commentEnd}\n`;

        navigator.clipboard.writeText(`${promo}${code}\n${promo}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // 🔹 Line numbers
    const getNumberedCode = (code) =>
        code
            .split("\n")
            .map((line, i) => `${i + 1}   ${line}`)
            .join("\n");

    // 🔹 Reset ads when switching codeId
    useEffect(() => {
        setAdCompleted({
            html: true,
            css: false,
            js: false,
        });
    }, [codeId]);

    // 🔹 Render
    return (
        <div className="design-code-section">
            {/* ==== Tabs ==== */}
            <div
                className="code-tabs"
                style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    marginBottom: "1rem",
                }}
            >
                {["html", "css", "js"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: "0.5rem 1rem",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                            background: activeTab === tab ? "#2575fc" : "#333",
                            color: "white",
                            fontWeight: activeTab === tab ? "bold" : "normal",
                            transition: "0.2s",
                        }}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}

                {/* 🔹 Copy button */}
                <button
                    onClick={handleCopy}
                    disabled={!canViewCode}
                    style={{
                        marginLeft: "auto",
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        border: "none",
                        background: canViewCode ? "#f7971e" : "#b5b5b5",
                        color: "black",
                        cursor: canViewCode ? "pointer" : "not-allowed",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "0.2s ease-in-out",
                        opacity: canViewCode ? 1 : 0.6,
                    }}
                >
                    <FaCopy />
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>

            {/* ==== Code box / Ads ==== */}
            <div style={{ position: "relative", fontSize: "0.85rem" }}>
                {isFree && !adCompleted[activeTab] ? (
                    <Ads_Container
                        boxType={activeTab}
                        adId={`${codeId}-${activeTab}`} // unique
                        onComplete={() =>
                            setAdCompleted((prev) => ({
                                ...prev,
                                [activeTab]: true,
                            }))
                        }
                    />
                ) : (
                    <pre
                        className="scrollable-code"
                        style={{
                            background: "#1e1e1e",
                            color: "#f5f5f5",
                            padding: "1rem",
                            borderRadius: "15px",
                            border: "1px solid gray",
                            minHeight: "400px",
                            maxHeight: "500px",
                            overflowX: "auto",
                            overflowY: "auto",
                            filter: canViewCode ? "none" : "blur(8px)",
                            pointerEvents: canViewCode ? "auto" : "none",
                        }}
                    >
                        <code ref={codeRef} className={`language-${activeTab}`}>
                            {getNumberedCode(getCode())}
                        </code>
                    </pre>
                )}

                {/* 🔹 Premium lock */}
                {isPremium && !hasBought && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0,0,0,0.6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                            backdropFilter: "blur(3px)",
                        }}
                    >
                        <button
                            onClick={() =>
                                navigate("/Payment_Page", {
                                    state: { amount: price, sourceId: "design-code" },
                                })
                            }
                            style={{
                                padding: "0.7rem 1.4rem",
                                borderRadius: "6px",
                                background: "#f7971e",
                                border: "none",
                                fontSize: "1rem",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            🔒 Unlock Premium Code — ${price}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
