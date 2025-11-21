import React, { useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-noconflict/theme-monokai";
import { FiCopy, FiCheck } from "react-icons/fi"; // copy icon
import "../assets/css/Template_Code.css"

const Template_Code = ({ template }) => {
    if (!template) return <div className="empty">Select a template to view code</div>;

    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500); // reset after 1.5s
    };

    // Hide code if Premium
    if (template.user_access === "Premium") {
        return (
            <div className="premium-lock">
                <p>This template is Premium. Buy to view code.</p>
                <button onClick={() => alert("Redirect to purchase page!")}>
                    Buy Premium - ${template.price}
                </button>
            </div>
        );
    }

    const renderCodeBlock = (title, code, mode, id, height = "200px") => (
        <div className="code-block" style={{ position: "relative", marginBottom: "20px" }}>
            <h4>{title}</h4>
            <button
                onClick={() => handleCopy(code, id)}
                className="copy-btn"
                style={{
                    position: "absolute",
                    right: "10px",
                    top: "5px",
                    padding: "4px 8px",
                    cursor: "pointer",
                    background: copiedId === id ? "#22c55e" : "#6366f1",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    zIndex: 10,
                }}
            >
            {copiedId === id ? <FiCheck /> : <FiCopy />}
            {copiedId === id ? "Copied!" : "Copy"}
        </button>
            <AceEditor
                mode={mode}
                theme="monokai"
                value={code}
                readOnly
                width="100%"
                height={height}
                setOptions={{ useWorker: false }}
            />
        </div>
    );

    return (
        <div className="code-wrap">

        {/* Show [HTML + CSS + JS] for html type code */}
            {template.type === "html" && (
                <>
                    {renderCodeBlock("HTML", template.html, "html", "html")}
                    {renderCodeBlock("CSS", template.css, "css", "css")}
                    {renderCodeBlock("JavaScript", template.js, "javascript", "js")}
                </>
            )}

        {/* Show [React + JS] for react type code */}
            {template.type === "react" && (
                <>
                    {renderCodeBlock("React Component (JSX)", template.react_code, "jsx", "react", "250px")}
                    {renderCodeBlock("CSS", template.css, "css", "react-css")}
                </>
            )}
        </div>
    );
};

export default Template_Code;
