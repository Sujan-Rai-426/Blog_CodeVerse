// src/template/Template_Preview.jsx
import React, { useEffect, useState } from "react";
import "../assets/css/Template_Preview.css";


const Template_Preview = ({ template, isProd = false }) => {
    const [srcDoc, setSrcDoc] = useState("");
    const [device, setDevice] = useState("desktop");

    const deviceWidth = {
        desktop: "100%",
        tablet: "768px",
        mobile: "375px",
    };

    // Generate iframe srcDoc
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
        } else if (template.type === "react") {
            if (isProd) {
                // Production: load precompiled bundle
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
                // Development: use Babel in browser
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

    if (!template) return <div className="empty">Select a template to preview</div>;

    const devices = [
        { label: "desktop", icon: <i className="bi bi-laptop-fill"></i> },
        { label: "tablet", icon: <i className="bi bi-tablet-fill"></i> },
        { label: "mobile", icon: <i className="bi bi-phone-fill"></i> },
    ];

    return (
        <div className="preview-wrap text-info">
            {/* Header */}
            <div className="preview-header">
                <h3>
                    {template.title} 
                </h3>

                {/* Device buttons */}
                <div className="device-buttons">
                    {devices.map((d) => (
                        <button
                            key={d.label}
                            className={device === d.label ? "active" : ""}
                            onClick={() => setDevice(d.label)}
                        >
                            {d.icon} 
                            {/* &nbsp; {d.label.charAt(0).toUpperCase() + d.label.slice(1)} */}
                        </button>
                    ))}
                </div>
            </div>

            {/* Iframe container */}
            <div
                className="iframe-container"
                style={{
                    width: deviceWidth[device],
                    maxWidth: "100%",
                    margin: "0 auto",
                    minHeight: "60vh",
                    borderRadius: 8,
                    overflow: "hidden",
                    boxShadow: "0 6px 18px rgba(2,6,23,0.08)",
                }}
            >
                <iframe
                    title={`preview-${template.id}`}
                    srcDoc={srcDoc}
                    sandbox={isProd ? "allow-scripts" : "allow-scripts allow-same-origin"}
                    style={{ width: "100%", height: "70vh", border: 0 }}
                />
            </div>
        </div>
    );
};

export default Template_Preview;
