import React, { useState, useRef } from "react";
import "../assets/css/Floating_Share_Btn.css";

export default function Floating_Share_Btn() {
  const [expanded, setExpanded] = useState(false);  // track if share menu is open
  const mainButtonRef = useRef(null);               // ref to trigger pulse on tap

  // toggle menu open/close and trigger short pulse effect
  const toggleExpand = () => {
    setExpanded(!expanded);
    const btn = mainButtonRef.current;
    if (btn) {
      btn.classList.add("echo-active");
      setTimeout(() => btn.classList.remove("echo-active"), 800);
    }
  };

// Hndle share btn on top right of component design
  const handleShareClick = (platform) => {
    const realUrl = window.location.href;
    const encodedUrl = encodeURIComponent(realUrl);

    // Title taken from the actual code/snippet page
    const pageTitle = encodeURIComponent(currentCodes?.title || "CodeVora Snippet");

    const isMobile = () =>
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    let shareUrl = "";

    switch (platform) {
      case "Facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;

      case "WhatsApp":
        shareUrl = `https://wa.me/?text=${pageTitle}%20${encodedUrl}`;
        break;

      case "Telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${pageTitle}`;
        break;

      case "Messenger":
        shareUrl = isMobile()
          ? `fb-messenger://share?link=${encodedUrl}`
          : `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=1949440582581236&redirect_uri=${encodedUrl}`;
        break;

      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=500");
  };




  return (
    <div className={`share-button-wrapper ${expanded ? "expanded" : ""}`}>
      <div ref={mainButtonRef} className="main-button">
        {/* collapsed: share icon */}
        {!expanded && (
          <i className="bi bi-share-fill toggle-button" onClick={toggleExpand}></i>
        )}
        {/* expanded: social icons + X button */}
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
            </div>
            <i className="bi bi-x-lg toggle-button p-2" onClick={toggleExpand}></i>
          </>
        )}
      </div>
    </div>
  );
}
