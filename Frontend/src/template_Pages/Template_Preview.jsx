// src/template_Pages/Template_Preview.jsx
import React, { useEffect, useState } from "react";
import { fetchTemplates } from "./Template_API";
import "../assets/css/Template_Preview.css";

const deviceSizes = {
  desktop: { width: "100%", height: "600px" },
  tablet: { width: "768px", height: "600px" },
  mobile: { width: "375px", height: "667px" },
};

const Template_Preview = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [device, setDevice] = useState("desktop");

  useEffect(() => {
    const loadTemplates = async () => {
      const data = await fetchTemplates();
      setTemplates(data);
    };
    loadTemplates();
  }, []);

  if (!templates.length) return <div>Loading templates...</div>;

  const selected = templates[selectedIndex];

  const goNext = () => {
    setSelectedIndex((prev) => (prev + 1) % templates.length);
  };

  const goPrev = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? templates.length - 1 : prev - 1
    );
  };

  const changeDevice = (d) => {
    setDevice(d);
  };

  const devices = [
    { label: "desktop", icon: <i className="bi bi-laptop-fill"></i> },
    { label: "tablet", icon: <i className="bi bi-tablet-fill"></i> },
    { label: "mobile", icon: <i className="bi bi-phone-fill"></i> },
  ];

  return (
    <div className="template-preview-container">

        <div className="template-preview">

{/* ============ Title + Description+ Header ============ */}
            <div className="preview-header">
                <h3>{selected.title}</h3>
                <p>{selected.project_info}</p>


{/* ===========Download + Device + Documentation=============== */}
                <div className="device-download-documentation">
                    {/* Device buttons */}
                      <div className="device-buttons">
                          {devices.map((d) => (
                              <button key={d.label} className={device === d.label ? "active" : ""} onClick={() => changeDevice(d.label)} >
                                  {d.icon}
                              </button>
                          ))}

                        {/* Access Type & Price */}
                          <div className="access-info">
                              <span className={`badge ${selected.access_type.toLowerCase()}`}>
                                  {selected.access_type}
                                  {selected.access_type === "Premium" && selected.price
                                      ? ` • $${selected.price}`
                                      : ""}
                              </span>
                          </div>
                      </div>

                    {/* Navigation & Actions */}
                      <div className="download-documentation">
                          <a href={selected.iframe_url} target="_blank" rel="noopener noreferrer" className="docs-btn" >
                              <i className="bi bi-arrows-fullscreen"></i>
                              <span className="btn-text"> FullScreen</span>
                          </a>
                          <a href={selected.repo_url} target="_blank" rel="noopener noreferrer" className="download-btn" >
                              <i className="bi bi-download"></i> 
                              <span className="btn-text"> Download</span>
                          </a>
                          <a href={selected.documentation} target="_blank" rel="noopener noreferrer" className="docs-btn" >
                              <i className="bi bi-file-earmark-code-fill"></i> 
                              <span className="btn-text"> Documentation</span>
                          </a>
                      </div>
                  </div>

            </div>

  {/* =========== Preview iframe =========== */}
            <div className="iframe-container">
              <iframe
                src={selected.iframe_url}
                title={selected.title}
                style={{
                  width: deviceSizes[device].width,
                  height: deviceSizes[device].height,
                  border: "1px solid #ccc",
                }}
              />
            </div>
        </div>
    </div>
  );
};

export default Template_Preview;
