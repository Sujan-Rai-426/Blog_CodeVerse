import React from "react";

const deviceSizes = {
    desktop: { width: "100%", height: "600px" },
    tablet: { width: "768px", height: "600px" },
    mobile: { width: "375px", height: "667px" },
};

export default function Design_Preview({ srcDoc, device, changeDevice }) {
    const devices = [
        { label: "desktop", icon: <i className="bi bi-pc-display-horizontal"></i> },
        { label: "tablet", icon: <i className="bi bi-tablet-fill"></i> },
        { label: "mobile", icon: <i className="bi bi-phone-fill"></i> },
    ];

    return (
        <div className="design-preview-section">
            {/* Device Selector */}
            <div className="device-download-documentation">
                <div className="device-buttons">
                    <div className="devices">
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
            </div>

            {/* Iframe */}
            <div className="iframe-container">
                <iframe
                    srcDoc={srcDoc}
                    sandbox="allow-scripts allow-forms allow-modals"
                    style={{
                        width: deviceSizes[device].width,
                        height: deviceSizes[device].height,
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                    }}
                    title="Preview"
                />
            </div>
        </div>
    );
}
