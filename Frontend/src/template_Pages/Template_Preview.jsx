// src/template_Pages/Template_Preview.jsx
import React, { useEffect, useState } from "react";
import { useTemplates } from "./Template_API";
import { Link, useParams } from "react-router-dom";
import "../assets/css/Template_Preview.css";
import {
    FaFacebook,
    FaFacebookMessenger,
    FaStar,
    FaTelegram,
    FaWhatsapp,
} from "react-icons/fa";

const deviceSizes = {
    desktop: { width: "100%", height: "570px" },
    tablet: { width: "789px", height: "650px" },  /* Total border width is 20px so we add 769+20 px for tablet view*/
    mobile: { width: "375px", height: "650px" },
};

const Template_Preview = () => {
    const { id } = useParams();
    const { getTemplateById, fetchTemplates } = useTemplates();
    const [template, setTemplate] = useState(null);
    const [device, setDevice] = useState("desktop");


    useEffect(() => {
        let mounted = true;
        const loadTemplate = async () => {
            let data = getTemplateById(id);
            if (!data) {
                await fetchTemplates();
                data = getTemplateById(id);
            }
            if (mounted) setTemplate(data);
        };
        loadTemplate();
        return () => (mounted = false);
    }, [id, getTemplateById, fetchTemplates]);


    // Helper for scrolling
    const scrollToSection = (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            const offset = -80;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: elementPosition + offset, behavior: "smooth" });
        }
    };

    if (!template) return <div className="loading">Loading template...</div>;



    const devices = [
        { label: "desktop", icon: <i className="bi bi-pc-display-horizontal" /> },
        { label: "tablet", icon: <i className="bi bi-tablet-fill" /> },
        { label: "mobile", icon: <i className="bi bi-phone-fill" /> },
    ];



    const handleShareClick = (platform) => {
        const realUrl = window.location.href;
        const encodedUrl = encodeURIComponent(realUrl);
        const pageTitle = encodeURIComponent(template?.title || document.title);
        const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        let shareUrl = "";
        switch (platform) {
            case "Facebook": shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${pageTitle}`; break;
            case "WhatsApp": shareUrl = `https://wa.me/?text=${pageTitle}%20${encodedUrl}`; break;
            case "Telegram": shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${pageTitle}`; break;
            case "Messenger":
                shareUrl = !realUrl.includes("localhost") && isMobile()
                    ? `fb-messenger://share?link=${encodedUrl}`
                    : `https://www.facebook.com/dialog/send?link=${encodedUrl}&redirect_uri=${encodedUrl}`;
                break;
            default:
                navigator.clipboard.writeText(realUrl);
                alert("Link copied!");
                return;
        }
        window.open(shareUrl, "_blank", "width=600,height=500");
    };



    const currentSize = deviceSizes[device] || deviceSizes.desktop;



    return (
        <div className="template-preview-container">
            <div className="template-preview">
                <div className="template-preview-header">
                    <h2>{template.title}</h2>
                    <p>{template.project_info}</p>

                    <div style={{ display: "flex", justifyContent: "space-between", padding: "0 0.5rem", alignItems: "center" }}>
                        {/* *************** Free PREMIUM BADGE ****************** */}
                            <div className="access-info">
                                <span className={`badge ${template.access_type.toLowerCase()}`}>
                                    {template.access_type}
                                    {template.access_type === "Premium" && template.price ? ` • $${template.price}` : ""}
                                </span>
                            </div>


                        {/* *****************  SHARE + PROJECT setup Guide BUTTON ******************** */}
                            <div style={{ display: "flex", gap: '1rem', margin: "0.8rem 0" }}>

                                {/* -----------------  SHARE BUTTON ------------------- */}
                                <div className="tmp-share-dropdown">
                                    <button className="tmp-share-btn" title="Share"><i className="fa fa-share-alt" /></button>
                                    <div className="tmp-share-options">
                                        <span onClick={() => handleShareClick("WhatsApp")}><FaWhatsapp className="share-icon" /> WhatsApp</span>
                                        <span onClick={() => handleShareClick("Messenger")}><FaFacebookMessenger className="share-icon" /> Messenger</span>
                                        <span onClick={() => handleShareClick("Facebook")}><FaFacebook className="share-icon" /> Facebook</span>
                                        <span onClick={() => handleShareClick("Telegram")}><FaTelegram className="share-icon" /> Telegram</span>
                                    </div>
                                </div>


                                {/* --------- Project Setup Guide BUTTON ------------- */}
                                <button className="download-guide bg-info" onClick={() => scrollToSection("PROJECT-SetUP-GUIDE")}>
                                    Project Setup Guide
                                </button>
                        </div>
                    </div>

                    {/* *************** DEVICE + DOWNLOAD + DOCS  ****************** */}
                    <div className="device-download-documentation">
                        {/* ----------CHANGE DEVICE SIZE ----------- */}
                        <div className="device-buttons">
                            <div className="devices">
                                {devices.map((d) => (
                                    <button
                                        key={d.label}
                                        className={device === d.label ? "active" : ""}
                                        onClick={() => setDevice(d.label)}
                                    >
                                        {d.icon}
                                    </button>
                                ))}
                            </div>
                            <Link to="/Templates/Topics" className="temp">
                                <i className="bi bi-columns"></i>
                            </Link>
                            <a href={template.github_repo_url} target="_blank" rel="noopener noreferrer" className="tp-github-star-a">
                                <span className="tp-github-star-icon"> <FaStar /> </span>
                            </a>
                        </div>

                        {/* ----------DOWNLOAD + DOCUMENTATION ----------- */}
                        <div className="download-documentation">
                            <a href={template.iframe_url} target="_blank" rel="noopener noreferrer" className="docs-btn">
                                <i className="bi bi-arrows-fullscreen"></i> <span className="btn-text"> FullScreen</span>
                            </a>
                            <a href={template.download_repo_url} target="_blank" rel="noopener noreferrer" className="download-btn">
                                <i className="bi bi-download"></i> <span className="btn-text"> Download</span>
                            </a>
                            <a href={template.documentation_url} target="_blank" rel="noopener noreferrer" className="docs-btn">
                                <i className="bi bi-file-earmark-code-fill"></i> <span className="btn-text"> Docs </span>
                            </a>
                        </div>
                    </div>
                </div>

            {/* Preview iframe Section */}
                <div className="tp-iframe-container">
                    {/* The wrapper gets the class: 'tp-iframe-wrapper desktop', 'tp-iframe-wrapper tablet', etc. */}
                    <div className={`tp-iframe-wrapper ${device}`}>
                        <iframe
                            src={template.iframe_url}
                            title={template.title}
                            style={{
                                width: "100%",
                                height: currentSize.height,
                            }}
                        />
                    </div>
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