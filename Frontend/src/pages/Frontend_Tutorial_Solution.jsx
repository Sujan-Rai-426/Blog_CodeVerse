import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import api from "../api";
import "../assets/css/Frontend_Tutorial_Solution.css";
import { FaCopy } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Ads_Container from "../context/Ads_Container";

/**
 * Main component for displaying a tutorial topic
 * Fetches topic data using topicID from URL
 * Shows videos with source code and handles premium access
 */
const Frontend_Tutorial_Solution = () => {
  const { topicID } = useParams(); // Get topicID from URL
  const topicId = parseInt(topicID); // Convert to number
  const [topic, setTopic] = useState(null); // Store topic data
  const [loading, setLoading] = useState(true); // Loading state for skeleton

  // Fetch topic from API when component mounts
  useEffect(() => {
    if (!topicID || isNaN(topicId)) {
      console.error("❌ Invalid topic ID:", topicID);
      setLoading(false);
      return;
    }

    const fetchTopic = async () => {
      try {
        const res = await api.get(`/api/topics/${topicId}/`);
        setTopic(res.data); // Save topic data
      } catch (error) {
        console.error("❌ Error fetching topic:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchTopic();
  }, [topicID]);

  // Highlight code syntax after loading
  useEffect(() => {
    Prism.highlightAll();
  }, [topic]);

  // Show skeleton loaders while fetching
  if (loading) {
    return (
      <div className="container py-4">
        <h4 className="text-center mb-4">
          <Skeleton width={250} height={25} baseColor="#2b2b2b" highlightColor="#444" />
        </h4>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="card video-card mb-5 p-2 shadow-lg rounded-4">
            <div className="video-container">
              <div className="video-wrapper">
                <Skeleton height={250} borderRadius={20} baseColor="#2b2b2b" highlightColor="#444" />
              </div>
              <div className="code-info-wrapper">
                <div className="card shadow-lg mb-1 d-flex flex-column h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-2">
                      <Skeleton width={50} height={20} baseColor="#3a3a3a" highlightColor="#555" />
                      <Skeleton width={50} height={20} baseColor="#3a3a3a" highlightColor="#555" />
                      <Skeleton width={50} height={20} baseColor="#3a3a3a" highlightColor="#555" />
                    </div>
                    <Skeleton width={70} height={25} baseColor="#3a3a3a" highlightColor="#555" />
                  </div>
                  <div className="card-body code-box">
                    <Skeleton count={6} height={18} baseColor="#2b2b2b" highlightColor="#444" style={{ marginBottom: "5px" }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="video-description mt-2">
              <Skeleton width={`60%`} baseColor="#2b2b2b" highlightColor="#444" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show message if topic not found
  if (!topic) return <p className="text-center mt-5">❌ Topic not found</p>;

  return (
    <div className="container py-1 px-1">
      <h4 className="text-center pt-3 text-warning">
        <b>🎬 Responsive Designs:</b>
        <br /> <p className="mt-3 mb-2 text-light"> <small> - {topic.name} - </small> </p>
      </h4>

      {/* Map through videos of this topic */}
      {topic.videos?.length > 0 && (
        <div>
          {topic.videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * VideoCard component
 * Shows video preview, source code, premium overlays, and copy button
 */
const VideoCard = ({ video }) => {
  const codeRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState("html"); // Current tab: html/css/js

  const showAdTabs = ["css", "js"]; // Tabs that require ads for free users
  const [adCompleted, setAdCompleted] = useState({ html: true, css: false, js: false }); // Track ad completion

  const handleAdComplete = (tab) => {
    setAdCompleted((prev) => ({ ...prev, [tab]: true }));
  };

  // Premium access for this video
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const navigate = useNavigate();

  // Buy premium button navigates to payment page
  const handleBuyPremium = () => {
    navigate("/Payment_Page", {
      state: {
        videoId: video.id,
        amount: 100, // Set your actual price here
      },
    });
  };

  // Get code string by tab
  const getCodeByTab = (codeObj, tab) => {
    switch (tab) {
      case "html": return codeObj.html_code || "";
      case "css": return codeObj.css_code || "";
      case "js": return codeObj.js_code || "";
      default: return "";
    }
  };

  // Highlight syntax when tab or access changes
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [selectedTab, adCompleted, hasPremiumAccess]);

  /**
   * CopyButton component
   * Copies code to clipboard with premium/ad restrictions
   */
  const CopyButton = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      // Check premium access for premium videos
      if (video.access_type === "Premium" && !hasPremiumAccess) {
        alert("⚠️ You need to buy Premium to copy this code!");
        return;
      }
      // Check ad completion for free videos
      if (video.access_type === "Free" && showAdTabs.includes(selectedTab) && !adCompleted[selectedTab]) {
        alert("⚠️ You can copy only after the ad finishes!");
        return;
      }
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const disabled =
      (video.access_type === "Premium" && !hasPremiumAccess) ||
      (video.access_type === "Free" && showAdTabs.includes(selectedTab) && !adCompleted[selectedTab]);

    return (
      <button className="copy-btn" onClick={handleCopy} disabled={disabled} style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }} >
        <FaCopy /> {copied ? "Copied!" : "Copy"}
      </button>
    );
  };

  return (
    <div className="card video-card mb-5 p-1 shadow-lg rounded-4">
      <div className="video-container">
        {/* Video preview */}
        <div className="video-wrapper">
          <div className="card shadow border-0" style={{ borderRadius: "20px", overflow: "hidden", height: "100%", position: "relative" }}>
            {/* Always render video, even for premium */}
            <div className={`video-container-inner ${video.access_type === "Premium" && !hasPremiumAccess ? "blurred-video" : ""}`}>
              <video src={video.video_url} autoPlay loop muted playsInline />
            </div>

            {/* Premium overlay */}
            {video.access_type === "Premium" && !hasPremiumAccess && (
              <div className="premium-video-overlay" style={{ pointerEvents: "none" }}>
                <div className="premium-badge">
                  <i className="bi bi-currency-dollar"></i> <small>PREMIUM</small>
                </div>
              </div>
            )}
          </div>
        </div>



        {/* Source code section */}
        <div className="code-info-wrapper">
          {video.source_codes?.map((codeObj, idx) => (
            <div key={idx} className="card shadow-lg mb-1 d-flex flex-column h-100">
              <div className="card-header d-flex justify-content-between align-items-center position-relative">
                {/* Tab buttons */}
                <div className="btn-group">
                  {["html", "css", "js"].map((tab) => (
                    <button key={tab} className={`btn-tab ${selectedTab === tab ? "active-tab" : ""}`} onClick={() => setSelectedTab(tab)} >
                      {tab.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Premium badge for code */}
                {video.access_type === "Premium" && (
                  <div className="premium-code-badge">
                    <i className="bi bi-currency-dollar" style={{ fontSize: "1.1rem" }}></i>
                  </div>
                )}

                <CopyButton code={getCodeByTab(codeObj, selectedTab)} />
              </div>

              <div className="card-body code-box">
                {/* Show code based on access type */}
                {video.access_type === "Free" ? (
                  showAdTabs.includes(selectedTab) && !adCompleted[selectedTab] ? (
                    <Ads_Container onComplete={() => handleAdComplete(selectedTab)} boxType={selectedTab} />
                  ) : (
                    <pre>
                      <code ref={codeRef} className={`language-${selectedTab}`}>
                        {getCodeByTab(codeObj, selectedTab)}
                      </code>
                    </pre>
                  )
                ) : (
                  <pre className={hasPremiumAccess ? "" : "blurred-code"}>
                    <code ref={codeRef} className={`language-${selectedTab}`}>
                      {getCodeByTab(codeObj, selectedTab)}
                    </code>
                  </pre>
                )}

                {/* Show buy button only if premium and no access */}
                {!hasPremiumAccess && video.access_type === "Premium" && (
                  <button className="buy-premium-btn" onClick={handleBuyPremium}>
                    💳 Buy Premium to Unlock
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Video description */}
      {video.info?.description && (
        <p className="video-description text-content">
          <b>NOTE:</b> {video.info.description}
        </p>
      )}
    </div>
  );
};

export default Frontend_Tutorial_Solution;
