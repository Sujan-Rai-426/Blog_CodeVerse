import React, { useState, useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import { FaCopy, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./assets/css/Components_Design_Code.css";

export default function Design_Code({
    html = "",
    css = "",
    js = "",
    codeId,
    access_type = "Free",
    price = 100,
    hasBought = false,
}) {
    if (!codeId) throw new Error("codeId prop is required for Design_Code");

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("html");
    const [copied, setCopied] = useState(false);
    const codeRef = useRef(null);

    // Derived Logic
    const isFree = access_type === "Free";
    const isPremium = access_type === "Premium";
    // Code is viewable if it's Free OR if it's Premium and already purchased
    const canViewCode = isFree || (isPremium && hasBought);

    // Trigger Prism Highlighting
    useEffect(() => {
        if (codeRef.current && canViewCode) {
            Prism.highlightElement(codeRef.current);
        }
    }, [activeTab, codeId, canViewCode]);

    const getCode = () => (activeTab === "html" ? html : activeTab === "css" ? css : js);

    // --- COPY LOGIC ---
    const handleCopy = () => {
        if (!canViewCode) return;
        const rawCode = getCode();
        
        let cStart = "// ";
        let cEnd = "";
        if (activeTab === "html") {
            cStart = "<!--";
            cEnd = " -->";
        } else if (activeTab === "css") {
            cStart = "/* ";
            cEnd = " */";
        }

        const promoLine = `${cStart}Code by CodeVora — https://codevora140.vercel.app ${cEnd}\n`;
        const defaultCSS = (activeTab === "css") 
            ? `/* Base Layout Provided by CodeVora */\nhtml, body { margin: 0; padding: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background: #1f1f20ff; }\n\n` 
            : "";

        const finalContent = `${promoLine}${defaultCSS}${rawCode}\n${promoLine}`;

        navigator.clipboard.writeText(finalContent).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => console.error("Copy failed", err));
    };

    const getNumberedCode = (code) =>
        code.split("\n").map((line, i) => `${i + 1}   ${line}`).join("\n");

    return (
        <div className="design-code-section">
            {/* TABS HEADER */}
            <div className="code-tabs-container">
                <div className="tabs-group">
                    {["html", "css", "js"].map((tab) => (
                        <button
                            key={tab}
                            className={`tab-item ${activeTab === tab ? "active" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.toUpperCase()} 
                            {isPremium && !hasBought && (
                                <span style={{ marginLeft: '5px', color: '#f7971e', fontSize: '13px', fontWeight: 'bold' }}>$</span>
                            )}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={handleCopy} 
                    disabled={!canViewCode} 
                    className={`copy-btn-new ${canViewCode ? "" : "disabled"}`}
                >
                    <FaCopy /> {copied ? "Copied!" : "Copy"}
                </button>
            </div>

            {/* CODE BODY */}
            <div className="dc-code-body" style={{ position: "relative", minHeight: "450px" }}>
                <div className="code-render-box" style={{ position: "relative" }}>
                    {/* PREMIUM LOCK OVERLAY */}
                    {isPremium && !hasBought && (
                        <div className="premium-lock-overlay" style={{
                            position: "absolute", inset: 0, zIndex: 10,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: "rgba(0,0,0,0.7)", borderRadius: "12px",
                            backdropFilter: "blur(4px)"
                        }}>
                            <button 
                                className="unlock-btn"
                                onClick={() => navigate("/Payment_Page", { state: { amount: price } })}
                                style={{
                                    padding: "12px 24px",
                                    background: "#f7971e",
                                    border: "none",
                                    borderRadius: "8px",
                                    color: "#000",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}
                            >
                                <FaLock /> Unlock {activeTab.toUpperCase()} — ${price}
                            </button>
                        </div>
                    )}

                    {/* CODE VIEW */}
                    <pre className="scrollable-code" style={{ 
                        filter: canViewCode ? "none" : "blur(12px)",
                        pointerEvents: canViewCode ? "auto" : "none" 
                    }}>
                        <code ref={codeRef} className={`language-${activeTab}`}>
                            {getNumberedCode(getCode())}
                        </code>
                    </pre>
                </div>
            </div>
        </div>
    );
}


