import React from "react";

const deviceSizes = {
    desktop: { width: "100%", height: "550px" },
    tablet: { width: "771px", height: "550px" },
    mobile: { width: "355px", height: "550px" },
};

export default function Design_Preview({ srcDoc, device, changeDevice }) {
    const devices = [
        { label: "desktop", icon: <i className="bi bi-pc-display-horizontal"></i> },
        { label: "tablet", icon: <i className="bi bi-tablet-fill"></i> },
        { label: "mobile", icon: <i className="bi bi-phone-fill"></i> },
    ];

    const currentStyle = deviceSizes[device] || deviceSizes.desktop;

    return (
        <div className="design-preview-section">
            <div className="device-download-documentation">
                <div className="device-buttons">
                    <div className="devices">
                        {devices.map((d) => (
                            <button
                                key={d.label}
                                className={device === d.label ? "active" : ""}
                                onClick={() => changeDevice(d.label)}
                                type="button"
                            >
                                {d.icon}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* MAIN FIX: Added margin: 0 auto and explicit display: block */}
            <div className="dp-iframe-container">
                <iframe
                    srcDoc={srcDoc}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
                    style={{
                        // Use both width and maxWidth to override any external CSS
                        width: currentStyle.width,
                        maxWidth: currentStyle.width, 
                        minWidth: currentStyle.width === "100%" ? "100%" : currentStyle.width,
                        height: currentStyle.height,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
                        border: "none",
                        backgroundColor: "transparent",
                        border: "1px solid gray",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                        borderRadius: device === "desktop" ? "0px" : "12px", // Look like a device
                        display: "block",
                        margin: "0 auto"
                    }}
                    title="Preview"
                />
            </div>
        </div>
    );
}