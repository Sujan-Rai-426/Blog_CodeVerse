import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import api from "../api";
import "../assets/css/Frontend_Tutorial_Solution.css";
import { FaCopy } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Ads_Container from "../context/Ads_Container";

const Frontend_Tutorial_Solution = () => {
  const { topicID } = useParams();
  const topicId = parseInt(topicID);
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!topicID || isNaN(topicId)) {
      console.error("❌ Invalid topic ID:", topicID);
      setLoading(false);
      return;
    }

    const fetchTopic = async () => {
      try {
        const res = await api.get(`/api/topics/${topicId}/`);
        setTopic(res.data);
      } catch (error) {
        console.error("❌ Error fetching topic:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
  }, [topicID]);

  useEffect(() => {
    Prism.highlightAll();
  }, [topic]);

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

  if (!topic) return <p className="text-center mt-5">❌ Topic not found</p>;

  return (
    <div className="container py-1 px-1">
      <h4 className="text-center py-3 text-warning">
        <b>🎬 Responsive Designs:</b>
        <br /> <p className="mt-2"> <small>{topic.name}</small> </p>
      </h4>

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

const VideoCard = ({ video }) => {
  const codeRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState("html");

  const showAdTabs = ["css", "js"];
  const [adCompleted, setAdCompleted] = useState({
    html: true,
    css: false,
    js: false,
  });

  // Premium access for this video
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);

  const handleAdComplete = (tab) => {
    setAdCompleted((prev) => ({ ...prev, [tab]: true }));
  };

  const handleBuyPremium = () => {
    setHasPremiumAccess(true);
    alert("✅ Premium unlocked for this video!");
  };

  const getCodeByTab = (codeObj, tab) => {
    switch (tab) {
      case "html": return codeObj.html_code || "";
      case "css": return codeObj.css_code || "";
      case "js": return codeObj.js_code || "";
      default: return "";
    }
  };

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [selectedTab, adCompleted, hasPremiumAccess]);

  const CopyButton = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      if (video.access_type === "Premium" && !hasPremiumAccess) {
        alert("⚠️ You need to buy Premium to copy this code!");
        return;
      }
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
      <button className="copy-btn" onClick={handleCopy} disabled={disabled} style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer", }} >
        <FaCopy /> {copied ? "Copied!" : "Copy"}
      </button>
    );
  };

  return (
    <div className="card video-card mb-5 p-1 shadow-lg rounded-4">
      <div className="video-container">
        {/* Video */}
        <div className="video-wrapper">
          <div className="card shadow border-0" style={{ borderRadius: "20px", overflow: "hidden", height: "100%", position: "relative" }}>
            <video
              src={video.video_url}
              autoPlay       // starts playing automatically
              loop           // repeats after ending
              muted          // mutes audio (required for autoplay on mobile)
              playsInline    // ensures it plays inline on iOS instead of fullscreen
              className={`w-100 h-100 ${video.access_type === "Premium" && !hasPremiumAccess ? "blurred-video" : ""}`}
              controls       // show play/pause button
            />

            {/* Show overlay ONLY if Premium and NOT unlocked */}
            {video.access_type === "Premium" && !hasPremiumAccess && (
              <div className="premium-video-overlay">
                <div className="premium-badge">
                  <i className="bi bi-currency-dollar"></i> <small>PREMIUM</small>
                </div>
              </div>
            )}
          </div>

        </div>


        {/* Source code */}
        <div className="code-info-wrapper">
          {video.source_codes?.map((codeObj, idx) => (
            <div key={idx} className="card shadow-lg mb-1 d-flex flex-column h-100">
              <div className="card-header d-flex justify-content-between align-items-center position-relative">
                <div className="btn-group">
                  {["html", "css", "js"].map((tab) => (
                    <button key={tab} className={`btn-tab ${selectedTab === tab ? "active-tab" : ""}`} onClick={() => setSelectedTab(tab)} >
                      {tab.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Premium badge for code */}
                {video.access_type === "Premium" && (
                  // Dollor sign
                  <div className="premium-code-badge">
                    {hasPremiumAccess ? (
                      <> <i className="bi bi-currency-dollar" style={{ fontSize: "1.1rem" }}></i> </>
                    ) : (
                      <> <i className="bi bi-currency-dollar" style={{ fontSize: "1.1rem" }}></i></>
                    )}
                  </div>
                )}

                <CopyButton code={getCodeByTab(codeObj, selectedTab)} />
              </div>


              <div className="card-body code-box">
                {/* ✅ For Free Videos code */}
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
                  /* ✅ For Premium Videos code */
                  <>
                    {hasPremiumAccess ? (
                      <pre>
                        <code ref={codeRef} className={`language-${selectedTab}`}>
                          {getCodeByTab(codeObj, selectedTab)}
                        </code>
                      </pre>
                    ) : (
                      <>
                        <div className="buy-premium-overlay">
                          <button className="buy-premium-btn" onClick={handleBuyPremium}>
                            💳 Buy Premium to Unlock
                          </button>
                        </div>
                        <pre className="blurred-code">
                          <code ref={codeRef} className={`language-${selectedTab}`}>
                            {getCodeByTab(codeObj, selectedTab)}
                          </code>
                        </pre>
                      </>
                    )}
                  </>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      {video.info?.description && (
        <p className="video-description text-content">
          <b>NOTE:</b> {video.info.description}
        </p>
      )}
    </div>
  );
};




export default Frontend_Tutorial_Solution;
