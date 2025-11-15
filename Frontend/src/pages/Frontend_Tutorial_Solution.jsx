// ============================================================
// === Frontend_Tutorial_Solution.jsx (Parent API version) ===
// ============================================================

import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "../assets/css/Frontend_Tutorial_Solution.css";
import { FaCopy } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Ads_Container from "../context/Ads_Container";
import { Parent_API_Provider_Context } from "../context/Parent_API_Provider.jsx";

const Frontend_Tutorial_Solution = () => {
  const { topicID, videoId } = useParams();
  const topicId = parseInt(topicID, 10);
  const { data, loading: parentLoading } = useContext(Parent_API_Provider_Context);

  const [topic, setTopic] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [showCode, setShowCode] = useState({});
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const mainVideoRef = useRef(null);
  const codeRefs = useRef({});
  const navigate = useNavigate();

  // === Detect screen resize ===
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // === Show loading message after 3 seconds ===
  useEffect(() => {
    if (!parentLoading && data?.length > 0) {
      let found = null;

      for (const category of data) {
        for (const section of category.sections || []) {
          for (const language of section.languages || []) {
            const topicFound = language.topics?.find(
              (t) => String(t.id) === String(topicId)
            );
            if (topicFound) {
              found = topicFound;
              break;
            }
          }
          if (found) break;
        }
        if (found) break;
      }

      if (found) {
        setTopic(found);

        // Select video based on URL param
        const selectedVideo = videoId
          ? found.videos.find((v) => String(v.id) === String(videoId))
          : found.videos?.[0];

        setCurrentVideo(selectedVideo || null);
      } else {
        setTopic(null);
      }
    }
  }, [parentLoading, data, topicId, videoId]);

  // === Highlight code ===
  useEffect(() => {
    Prism.highlightAll();
  }, [currentVideo, isMobile]);

  // === Loading Skeleton ===
  if (parentLoading) {
    return (
      <div className="container py-4 position-relative text-center">
        <h4 className="text-center mb-4">
          <Skeleton width={250} height={25} />
        </h4>

        {[...Array(2)].map((_, i) => (
          <div key={i} className="card video-card mb-5 p-2 shadow-lg rounded-4 skeleton-card">
            <Skeleton height={isMobile ? 180 : 250} borderRadius={20} />
            <div className="card-body mt-3">
              <Skeleton width="70%" height={20} className="mb-2" />
              <Skeleton width="90%" height={14} count={2} />
              <Skeleton width={110} height={32} borderRadius={20} className="mt-3" />
            </div>
          </div>
        ))}

        {showMessage && (
          <div className="loading-message fade-in">
            <h2>Good things take time</h2>
            <p>Almost there! Hold tight! Loading the magic ✨...</p>
          </div>
        )}
      </div>
    );
  }

  if (!topic) return <p className="text-center mt-5">❌ Topic not found</p>;

  // === Mobile Layout ===
  if (isMobile) {
    // Reorder videos: if videoId exists in URL, bring that video to top
    let mobileVideos = [...(topic.videos || [])];
    if (videoId) {
      const index = mobileVideos.findIndex(v => String(v.id) === String(videoId));
      if (index > -1) {
        const [selectedVideo] = mobileVideos.splice(index, 1);
        mobileVideos = [selectedVideo, ...mobileVideos];
      }
    }

    return (
      <div className="container py-4">
        <h3 className="text-center text-warning mb-4">🎬 {topic.name}</h3>
        <div className="video-main-wrapper">
          {mobileVideos.map((video) => (
            <div className="video-wrapper mb-4 position-relative" key={video.id}>
              {(video.access_type === "Premium" ||
                video.source_codes?.some((code) => code.access_type === "Premium")) && (
                <div className="video-price-tag"><i className="bi bi-currency-dollar"></i></div>
              )}

              <div className="video-container-inner">
                <video key={video.id} src={video.video_url} autoPlay loop muted playsInline />
              </div>

              <div className="video-description text-white">
                <p className="mb-0 mt-2 mx-2">{video.info?.description || "No description"}</p>
              </div>

              <div className="d-flex justify-content-center m-0">
                <button
                  className="view-hide-code-btn"
                  onClick={() => setShowCode((prev) => ({ ...prev, [video.id]: !prev[video.id] }))}
                >
                  {showCode[video.id] ? "← Hide Code" : "View Code →"}
                </button>
              </div>

              {showCode[video.id] && (
                <div className="code-info-wrapper mt-3">
                  {video.source_codes?.map((codeObj, idx) => (
                    <VideoCodeBox key={idx} codeObj={codeObj} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }


  // === Desktop Layout ===
  if (!currentVideo) return <p className="text-center mt-5">Loading video...</p>;

  return (
    <div className="container py-4">
      <h3 className="text-center text-warning mb-4">🎬 {topic.name}</h3>
      <div className="video-main-wrapper">
        <div className="video-wrapper" ref={mainVideoRef}>
          {(currentVideo.access_type === "Premium" ||
            currentVideo.source_codes?.some((code) => code.access_type === "Premium")) && (
            <div className="video-price-tag"><i className="bi bi-currency-dollar"></i></div>
          )}

          <div className="video-container-inner">
            <video
              key={currentVideo?.id}
              src={currentVideo?.video_url}
              autoPlay
              loop
              muted
              playsInline
            />
          </div>

          <div className="video-description text-white">
            <p className="mb-0 mt-2 mx-2 py-2">{currentVideo?.info?.description || "No description"}</p>
          </div>

          <div className="d-flex justify-content-center m-0">
            <button
              className="view-hide-code-btn"
              onClick={() => {
                setShowCode((prev) => {
                  const newState = { ...prev, [currentVideo.id]: !prev[currentVideo.id] };
                  if (!prev[currentVideo.id]) {
                    setTimeout(() => {
                      codeRefs.current[currentVideo.id]?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 100);
                  }
                  return newState;
                });
              }}
            >
              {showCode[currentVideo.id] ? "← Hide Code" : "View Code →"}
            </button>
          </div>

          {showCode[currentVideo.id] && (
            <div className="code-info-wrapper mt-2" ref={(el) => (codeRefs.current[currentVideo.id] = el)}>
              {currentVideo.source_codes?.map((codeObj, idx) => (
                <VideoCodeBox key={idx} codeObj={codeObj} />
              ))}
            </div>
          )}
        </div>

        <div className="related-videos">
          {topic.videos
            ?.filter((v) => v.id !== currentVideo.id)
            .map((video) => (
              <div
                key={video.id}
                className="video-card"
                onClick={() => {
                  navigate(`/Frontend_Tutorial_Solution/${topicID}/${video.id}`);
                  setShowCode({});
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {(video.access_type === "Premium" ||
                  video.source_codes?.some((code) => code.access_type === "Premium")) && (
                  <div className="video-price-tag">$</div>
                )}

                <div className="video-card-thumb">
                  <video src={video.video_url} muted playsInline />
                </div>

                <div className="video-card-info">
                  <h5>{video.title}</h5>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// === Code Box Component ===
// ============================================================
const VideoCodeBox = ({ codeObj }) => {
  const codeRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState("html");
  const [adCompleted, setAdCompleted] = useState({ html: true, css: false, js: false });
  const navigate = useNavigate();

  useEffect(() => {
    if (codeRef.current) Prism.highlightElement(codeRef.current);
  }, [selectedTab, adCompleted]);

  const handleAdComplete = (tab) => setAdCompleted((prev) => ({ ...prev, [tab]: true }));

  const getCodeByTab = (tab) => {
    switch (tab) {
      case "html": return codeObj.html_code || "";
      case "css": return codeObj.css_code || "";
      case "js": return codeObj.js_code || "";
      default: return "";
    }
  };

  const isFree = codeObj.access_type === "Free";
  const isPremium = codeObj.access_type === "Premium";
  const hasBought = codeObj.hasBought === true;
  const canViewCode = (isFree && adCompleted[selectedTab]) || (isPremium && hasBought);

  const CopyButton = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      if (!canViewCode) return;
      const commentStart = selectedTab === "html" ? "<!-- " : selectedTab === "css" ? "/* " : "// ";
      const commentEnd = selectedTab === "html" ? " -->" : selectedTab === "css" ? " */" : "";
      const promoMessage = `${commentStart}Code by CodeVerse.\nvisit official site for more free designs and tutorial :\n :--- ' https://blog-code-verse.vercel.app ' ${commentEnd}\n`;
      const finalCode = `${promoMessage}${code}\n${promoMessage}`;
      navigator.clipboard.writeText(finalCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <button className={`copy-btn ${canViewCode ? "" : "disabled-copy-btn"}`} onClick={handleCopy} disabled={!canViewCode}>
        <FaCopy /> {copied ? "Copied!" : "Copy"}
      </button>
    );
  };

  return (
    <div className="card shadow-lg mb-1 d-flex flex-column h-100 position-relative">
      <div className="card-header d-flex justify-content-between align-items-center position-relative">
        <div className="btn-group">
          {["html", "css", "js"].map((tab) => (
            <button key={tab} className={`btn-tab ${selectedTab === tab ? "active-tab" : ""}`} onClick={() => setSelectedTab(tab)}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="copy-price-wrapper">
          {isPremium && !hasBought && <div className="price-tag">${codeObj.price || 100}</div>}
          <CopyButton code={getCodeByTab(selectedTab)} />
        </div>
      </div>

      <div className="card-body position-relative">
        {isPremium && !hasBought ? (
          <div className="code-wrapper">
            <pre className="scrollable-code">
              <code ref={codeRef} className={`language-${selectedTab}`}>{getCodeByTab(selectedTab)}</code>
            </pre>
            <div className="buy-btn-overlay">
              <button className="buy-premium-btn" onClick={() => navigate("/Payment_Page", { state: { sourceId: codeObj.id, amount: codeObj.price || 100 } })}>
                💳 Buy Premium Code
              </button>
            </div>
          </div>
        ) : isFree && !adCompleted[selectedTab] ? (
          <Ads_Container onComplete={() => handleAdComplete(selectedTab)} boxType={selectedTab} />
        ) : (
          <div className="code-wrapper">
            <pre>
              <code ref={codeRef} className={`language-${selectedTab}`}>{getCodeByTab(selectedTab)}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Frontend_Tutorial_Solution;
