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
  desktop: { width: "100%", height: "600px" },
  tablet: { width: "770px", height: "600px" },
  mobile: { width: "368px", height: "667px" },
};

const Template_Preview = () => {
  const { id } = useParams();

  const [template, setTemplate] = useState(null);
  const [device, setDevice] = useState("desktop");

  const { getTemplateById, fetchTemplates } = useTemplates();

  useEffect(() => {
    let mounted = true;
    const loadTemplate = async () => {
      let data = getTemplateById(id);
      if (!data) {
        await fetchTemplates(); // only fetch if templates not loaded
        data = getTemplateById(id);
      }
      if (mounted) setTemplate(data);
    };
    loadTemplate();
    return () => (mounted = false);
  }, [id, getTemplateById, fetchTemplates]);


  if (!template) return <div>Loading template...</div>;

  const changeDevice = (d) => setDevice(d);

  const devices = [
    { label: "desktop", icon: <i className="bi bi-pc-display-horizontal" /> },
    { label: "tablet", icon: <i className="bi bi-tablet-fill" /> },
    { label: "mobile", icon: <i className="bi bi-phone-fill" /> },
  ];

  // ===== SHARE HANDLER =====
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
        if (!realUrl.includes("localhost") && isMobile()) {
          shareUrl = `fb-messenger://share?link=${encodedUrl}`;
        } else {
          shareUrl = `https://www.facebook.com/dialog/send?link=${encodedUrl}&redirect_uri=${encodedUrl}`;
        }
        break;
      default:
        navigator.clipboard.writeText(realUrl);
        alert("Link copied!");
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=500");
  };

  return (
    <div className="template-preview-container">
      <div className="template-preview">

        {/* HEADER */}
        <div className="template-preview-header">
          <h2>{template.title}</h2>
          <p>{template.project_info}</p>

          {/* ACCESS */}
          <span className={`badge ${template.access_type.toLowerCase()}`}>
            {template.access_type}
            {template.access_type === "Premium" && ` • $${template.price}`}
          </span>

          {/* SHARE */}
          <div className="tmp-share-dropdown">
            <button className="tmp-share-btn">
              <i className="fa fa-share-alt" />
            </button>
            <div className="tmp-share-options">
              <span onClick={() => handleShareClick("WhatsApp")}><FaWhatsapp /> WhatsApp</span>
              <span onClick={() => handleShareClick("Messenger")}><FaFacebookMessenger /> Messenger</span>
              <span onClick={() => handleShareClick("Facebook")}><FaFacebook /> Facebook</span>
              <span onClick={() => handleShareClick("Telegram")}><FaTelegram /> Telegram</span>
            </div>
          </div>

          {/* DEVICE CONTROLS */}
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

          {/* LINKS */}
          <div className="preview-actions">
            <Link to="/Templates"><i className="bi bi-columns" /></Link>
            <a href={template.github_repo_url} target="_blank" rel="noreferrer">
              <FaStar />
            </a>
          </div>
        </div>

        {/* IFRAME */}
        <div className="iframe-container">
          <iframe
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
