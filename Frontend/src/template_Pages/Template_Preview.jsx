import React, { useEffect, useState } from "react";
import { fetchTemplateById } from "./Template_API";
import { Link, useParams } from "react-router-dom";
import "../assets/css/Template_Preview.css";

const deviceSizes = {
  desktop: { width: "100%", height: "600px" },
  tablet: { width: "768px", height: "600px" },
  mobile: { width: "375px", height: "667px" },
};

const Template_Preview = () => {
  const { id } = useParams(); // ✅ get id from route
  const [template, setTemplate] = useState(null);
  const [device, setDevice] = useState("desktop");

  useEffect(() => {
    const loadTemplate = async () => {
      const data = await fetchTemplateById(id);
      setTemplate(data);
    };
    loadTemplate();
  }, [id]);

  if (!template) return <div>Loading template...</div>;

  const changeDevice = (d) => setDevice(d);

  const devices = [
    { label: "desktop", icon: <i className="bi bi-pc-display-horizontal"></i> },
    { label: "tablet", icon: <i className="bi bi-tablet-fill"></i> },
    { label: "mobile", icon: <i className="bi bi-phone-fill"></i> },
  ];

          // Scroll to section function using id
    const scrollToSection = (id) => {
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                const offset = -100; // scroll 100px more upwards (adjust as needed)
                const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                const finalPosition = elementPosition + offset;

                window.scrollTo({
                    top: finalPosition,
                    behavior: "smooth",
                });
            }
        }, 120); // wait for react-router navigation
    };

  return (
    <div className="template-preview-container">
      <div className="template-preview">
        <div className="preview-header">
          <h3>{template.title}</h3>
          <p>{template.project_info}</p>

          <div className="device-download-documentation">

            {/* === Device btn + Price Tag + Template ==== */}
              <div className="device-buttons">

                  {/* devices type */}
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

                    {/* price tag and template */}
                <div className="access-info">
                  <span className={`badge ${template.access_type.toLowerCase()}`}>
                    {template.access_type}
                    {template.access_type === "Premium" && template.price
                      ? ` • $${template.price}`
                      : ""}
                  </span>
                  <Link to="/Templates" className="temp" onClick={() => scrollToSection('TEMPLATE')}> 
                    <i className="bi bi-columns"></i> 
                  </Link>
                </div>
              </div>

            {/* ======== Download + Docmentation + Screen Size ====== */}
              <div className="download-documentation">
                <a
                  href={template.iframe_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="docs-btn"
                >
                  <i className="bi bi-arrows-fullscreen"></i>
                  <span className="btn-text"> FullScreen</span>
                </a>
                <a
                  href={template.download_repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-btn"
                >
                  <i className="bi bi-download"></i>
                  <span className="btn-text"> Download</span>
                </a>
                <a
                  href={template.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="docs-btn"
                >
                  <i className="bi bi-file-earmark-code-fill"></i>
                  <span className="btn-text"> Documentation</span>
                </a>

              </div>

          </div>
        </div>

        {/* Preview iframe */}
        <div className="iframe-container">
          <iframe
            key={template.id}
            src={template.iframe_url}
            title={template.title}
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
