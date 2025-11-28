import React, { useEffect, useState } from "react";
import { fetchTemplateById } from "./Template_API";
import { Link, useParams } from "react-router-dom";
import "../assets/css/Template_Preview.css";
import { FaFacebook, FaFacebookMessenger, FaTelegram, FaWhatsapp } from "react-icons/fa";

const deviceSizes = {
  desktop: { width: "100%", height: "600px" },
  tablet: { width: "768px", height: "600px" },
  mobile: { width: "375px", height: "667px" },
};

const Template_Preview = () => {
  const { id } = useParams(); // get id from route
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

  // <------- handle SHARE ------>
  const handleShareClick = (platform) => {
    const realUrl = window.location.href;
    const encodedUrl = encodeURIComponent(realUrl);
    const pageTitle = encodeURIComponent(template?.title || document.title);

    const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let shareUrl = "";

    switch (platform) {
      case "Facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${pageTitle}`;
        break;

      case "WhatsApp":
        shareUrl = `https://wa.me/?text=${pageTitle}%20${encodedUrl}`;
        break;

      case "Telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${pageTitle}`;
        break;

      case "Messenger":
        // Only use fb-messenger scheme if not localhost and on mobile
        if (!realUrl.includes("localhost") && isMobile()) {
          shareUrl = `fb-messenger://share?link=${encodedUrl}`;
        } else {
          // fallback to Facebook Send Dialog for desktop or localhost
          shareUrl = `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=1949440582581236&redirect_uri=${encodedUrl}`;
        }
        break;

      default:
        navigator.clipboard.writeText(realUrl);
        alert("Link copied!");
        return;
    }

    const width = 600;
    const height = 500;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      shareUrl,
      "_blank",
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
  };


  // <------- Scroll to section function using id ----->
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
            <div className="template-preview-header">
                <h2>{template.title}</h2>
                <p>{template.project_info}</p>

                {/* price tag Badge and Project setup guide*/}
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "0 0.5rem",}}>
                    {/* Price Tag Badge */}
                      <div className="access-info">
                        <span className={`badge ${template.access_type.toLowerCase()}`}>
                          {template.access_type}
                          {template.access_type === "Premium" && template.price
                            ? ` • $${template.price}`
                            : ""}
                        </span>
                      </div>

                    {/* SHARE + Project Setup guide */}
                      <div style={{display: "flex", flexDirection: "row", gap:'1rem', margin: "0.8rem 0"}}>
                          {/* Share Dropdown */}
                          <div className="tmp-share-dropdown">
                            <button className="tmp-share-btn" title="Share">
                              <i className="fa fa-share-alt" />
                            </button>
                            <div className="tmp-share-options">
                              <span onClick={() => handleShareClick("WhatsApp")}>
                                <FaWhatsapp className="share-icon" /> WhatsApp
                              </span>
                              <span onClick={() => handleShareClick("Messenger")}>
                                <FaFacebookMessenger className="share-icon" /> Messenger
                              </span>
                              <span onClick={() => handleShareClick("Facebook")}>
                                <FaFacebook className="share-icon" /> Facebook
                              </span>
                              <span onClick={() => handleShareClick("Telegram")}>
                                <FaTelegram className="share-icon" /> Telegram
                              </span>
                            </div>
                          </div>

                          {/* Project SetUp Guide */}
                          <button 
                            className="download-guide bg-info"
                            onClick={() => {
                              const element = document.getElementById("PROJECT-SetUP-GUIDE");
                              if (element) {
                                const offset = -80; // optional offset for sticky headers
                                const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                                const finalPosition = elementPosition + offset;

                                window.scrollTo({
                                  top: finalPosition,
                                  behavior: "smooth",
                                });
                              }
                            }}
                          >
                            Project Setup Guide
                          </button>
                      </div>
                </div>

                  {/* Device + Template+ Donwload + documentation + Fullscreen icons */}
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

                        {/* Template icon */}
                          <Link to="/Templates" className="temp" onClick={() => scrollToSection('TEMPLATE')}> 
                            <i className="bi bi-columns"></i> 
                          </Link>
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


            {/* ===== Section to show Coding Guide ======= */}
            <div id="PROJECT-SetUP-GUIDE" className="run-instructions">
                  <h3>How to Run This Project Locally</h3>
                  <p>Follow the steps below depending on your setup:</p>

                  {/* Case 1: Frontend Only */}
                  <div className="case">
                      <h4>Case 1: Frontend Only (React / Vite)</h4>
                      <ol>
                          <li>Download the project zip from GitHub and extract it to a folder on your computer.</li>
                          <li>Open a terminal and navigate to the project folder.</li>
                          <li>Install dependencies: <code>npm install</code> or <code>yarn install</code></li>
                          <li>Start the development server: <code>npm run dev</code> or <code>yarn dev</code></li>
                          <li>Open the URL provided by Vite (usually <code>http://127.0.0.1:5173/</code>) in your browser.</li>
                          <li>Follow the documentation if there are extra environment variables or configuration.</li>
                      </ol>
                  </div>

                {/* Case 2: Frontend + Backend */}
                  <div className="case">
                      <h4>Case 2: Frontend + Backend (React + Django REST Framework)</h4>
                      <ol>
                          <li>
                            <strong>Download the project</strong> from GitHub and extract it.
                          </li>
                          <li>
                              <strong>Backend setup (Django REST Framework):</strong>
                              <ul>
                                  <li>Navigate to the backend folder.</li>
                                  <li>Create a virtual environment: <code>python -m venv env</code></li>
                                  <li>Activate the environment: <code>env\Scripts\activate</code> (Windows) or <code>source env/bin/activate</code> (Linux/macOS)</li>
                                  <li>Install dependencies: <code>pip install -r requirements.txt</code></li>
                                  <li>Apply migrations: <code>python manage.py migrate</code></li>
                                  <li>Create superuser: <code>python manage.py createsuperuser</code> (optional)</li>
                                  <li>Run backend server: <code>python manage.py runserver</code></li>
                                  <li>Backend should run at <code>http://127.0.0.1:8000/</code></li>
                              </ul>
                          </li>

                          <li>
                              <strong>Frontend setup (Vite + React):</strong>
                              <ul>
                                  <li>Navigate to the frontend folder.</li>
                                  <li>Install dependencies: <code>npm install</code> or <code>yarn install</code></li>
                                  <li>Configure API URL in <code>.env</code> file: <code>VITE_API_URL=http://127.0.0.1:8000/api/</code></li>
                                  <li>Start frontend: <code>npm run dev</code> or <code>yarn dev</code></li>
                                  <li>Open the Vite localhost URL (usually <code>http://127.0.0.1:5173/</code>) in your browser.</li>
                              </ul>
                          </li>
                          
                          <li>Check that the frontend loads data from backend correctly.</li>
                          <li>Admin dashboard: <code>http://127.0.0.1:8000/admin/</code> to manage templates, categories, and other data.</li>
                          <li>Follow the project documentation for additional setup if needed.</li>
                      </ol>
                  </div>
            </div>

        </div>
    </div>
  );
};

export default Template_Preview;
