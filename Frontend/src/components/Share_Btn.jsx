import React, { useState } from "react";
import "../assets/css/Share_Btn.css";

export default function Share_Btn() {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);

  const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleShareClick = (platform) => {
    const pageUrl = encodeURIComponent("https://blog-code-verse.vercel.app"); 
    const pageTitle = encodeURIComponent(document.title);
    let shareUrl = "";

    switch (platform) {
      case "Facebook":
        if (isMobile()) {
          // Open Facebook app with preview
          shareUrl = `fb://facewebmodal/f?href=https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
        } else {
          // Desktop fallback
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
        }
        break;

      case "WhatsApp":
        shareUrl = `https://wa.me/?text=${pageTitle}%20${pageUrl}`;
        break;

      case "Messenger":
        if (isMobile()) {
          shareUrl = `fb-messenger://share?link=${pageUrl}`;
        } else {
          const appId = "sujanrai426@gmail.com";
          shareUrl = `https://www.facebook.com/dialog/send?link=${pageUrl}&app_id=${appId}&redirect_uri=${pageUrl}`;
        }
        break;

      case "Telegram":
        shareUrl = `https://t.me/share/url?url=${pageUrl}&text=${pageTitle}`;
        break;

      case "Youtube":
        shareUrl = `https://www.youtube.com/share?url=${pageUrl}`;
        break;

      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=500");
  };

  return (
    <div className={`share-button-wrapper ${expanded ? "expanded" : ""}`}>
      <div className="main-button">
        {!expanded && (
          <i className="bi bi-share-fill toggle-button" onClick={toggleExpand}></i>
        )}
        {expanded && (
          <>
            <div className="social-icons">
              <span onClick={() => handleShareClick("Facebook")}>
                <i className="bi bi-facebook"></i>
              </span>
              <span onClick={() => handleShareClick("WhatsApp")}>
                <i className="bi bi-whatsapp"></i>
              </span>
              <span onClick={() => handleShareClick("Messenger")}>
                <i className="bi bi-messenger"></i>
              </span>
              <span onClick={() => handleShareClick("Telegram")}>
                <i className="bi bi-telegram"></i>
              </span>
              <span onClick={() => handleShareClick("Youtube")}>
                <i className="bi bi-youtube"></i>
              </span>
            </div>
            <i className="bi bi-x-lg toggle-button p-2" onClick={toggleExpand}></i>
          </>
        )}
      </div>
    </div>
  );
}
