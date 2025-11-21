// src/template_Pages/Template_Preview.jsx
import React, { useEffect, useState } from "react";
import "../assets/css/Template_Preview.css";

const Template_Preview = ({ template, isProd = false }) => {
    const [srcDoc, setSrcDoc] = useState("");
    const [device, setDevice] = useState("desktop");

    // Device widths
    const deviceWidth = {
        desktop: "100%",
        tablet: "768px",
        mobile: "375px",
    };

    // Force iframe reload on device switch
    const [frameKey, setFrameKey] = useState(0);
    const changeDevice = (d) => {
        setDevice(d);
        setFrameKey((prev) => prev + 1);
    };

    // Generate iframe HTML
    useEffect(() => {
        if (!template) return;

        if (template.type === "html") {
            setSrcDoc(`
                <html>
                    <head><style>${template.css}</style></head>
                    <body>
                        ${template.html}
                        <script>
                            try { ${template.js} } catch(e) {
                                document.body.innerHTML += '<pre style="color:red">' + e + '</pre>';
                            }
                        </script>
                    </body>
                </html>
            `);
        } 
        else if (template.type === "react") {
            if (isProd) {
                setSrcDoc(`
                    <html>
                        <head><style>${template.css}</style></head>
                        <body>
                            <div id="root"></div>
                            <script src="${template.bundleUrl}"></script>
                        </body>
                    </html>
                `);
            } else {
                setSrcDoc(`
                    <html>
                        <head>
                            <style>${template.css}</style>
                            <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                            <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                        </head>
                        <body>
                            <div id="root"></div>
                            <script type="text/babel">
                                ${template.react_code}
                                ReactDOM.createRoot(document.getElementById('root')).render(<Card />);
                            </script>
                        </body>
                    </html>
                `);
            }
        }
    }, [template, isProd]);

    const devices = [
        { label: "desktop", icon: <i className="bi bi-laptop-fill"></i> },
        { label: "tablet", icon: <i className="bi bi-tablet-fill"></i> },
        { label: "mobile", icon: <i className="bi bi-phone-fill"></i> },
    ];

    if (!template) return <div className="empty">Select a template to preview</div>;

    return (
        <div className="preview-wrap">

            {/* Header */}
            <div className="preview-header">
                <h3>{template.title}</h3>

                <div className="device-buttons">
                    {devices.map((d) => (
                        <button
                            key={d.label}
                            className={device === d.label ? "active" : ""}
                            onClick={() => changeDevice(d.label)}
                        >
                            {d.icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* iframe preview */}
            
        <div
            className="iframe-container"
            style={{
                width: deviceWidth[device],
                maxWidth: "100%",
                margin: "0 auto",
                borderRadius: 8,
                overflow: "auto", // allow scroll if content overflows
                boxShadow: "0 6px 18px rgba(2,6,23,0.08)",
                background: "#f9fafb",
                height: "75vh",
            }}
        >
            <iframe
                key={frameKey}
                title={`preview-${template.id}`}
                srcDoc={srcDoc}
                sandbox="allow-scripts allow-same-origin"
                style={{
                    width: "100%",
                    height: "100%",      // fill the container
                    border: "none",
                    display: "block",
                }}
            />
        </div>

        </div>
    );
};

export default Template_Preview;
