import React, { useState } from "react";
import "../assets/css/Share_Btn.css";

export default function Share_Btn() {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleShareClick = (platform) => {
    const pageUrl = encodeURIComponent(window.location.href); // Current page URL
    const pageTitle = encodeURIComponent(document.title); // Page title
    let shareUrl = "";

    switch (platform) {
      case "Facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
        break;

      case "WhatsApp":
        shareUrl = `https://wa.me/?text=${pageTitle}%20${pageUrl}`;
        break;

      case "Messenger":
        // Facebook Web Dialog for Messenger
        const appId = "YOUR_FB_APP_ID"; // Replace with your FB App ID
        shareUrl = `https://www.facebook.com/dialog/send?link=${pageUrl}&app_id=${appId}&redirect_uri=${pageUrl}`;
        break;

      case "Telegram":
        shareUrl = `https://t.me/share/url?url=${pageUrl}&text=${pageTitle}`;
        break;

      case "Youtube":
        // Open YouTube share page with your URL
        shareUrl = `https://www.youtube.com/share?url=${pageUrl}`;
        break;

      default:
        return;
    }

    // Open the share URL in a small popup window
    window.open(shareUrl, "_blank", "width=600,height=500");
  };

  return (
    <div className={`share-button-wrapper ${expanded ? "expanded" : ""}`}>
      <div className="main-button">
        {!expanded && (
          <i
            className="bi bi-share-fill toggle-button"
            onClick={toggleExpand}
          ></i>
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
            <i
              className="bi bi-x-lg toggle-button p-2"
              onClick={toggleExpand}
            ></i>
          </>
        )}
      </div>
    </div>
  );
}
