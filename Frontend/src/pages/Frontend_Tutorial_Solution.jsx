

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
  const [activeCodeVideo, setActiveCodeVideo] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const codeRefs = useRef({});
  const navigate = useNavigate();

  // Detect screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Find topic after parent data loads
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
        const sortedVideos = [...(found.videos || [])].sort((a, b) => b.id - a.id);
        found.videos = sortedVideos;
        setTopic(found);

        const selectedVideo = videoId
          ? sortedVideos.find((v) => String(v.id) === String(videoId))
          : sortedVideos[0];

        setCurrentVideo(selectedVideo || null);
        setActiveCodeVideo(null); // Ensure code does not auto-open
      } else {
        setTopic(null);
      }
    }
  }, [parentLoading, data, topicId, videoId]);

  // Update current video when videoId changes
  useEffect(() => {
    if (!topic) return;
    const sortedVideos = [...(topic.videos || [])].sort((a, b) => b.id - a.id);
    let selectedVideo = sortedVideos[0];
    if (videoId) {
      const index = sortedVideos.findIndex((v) => String(v.id) === String(videoId));
      if (index > -1) selectedVideo = sortedVideos[index];
    }
    setCurrentVideo(selectedVideo);
    setActiveCodeVideo(null); // reset code on video change
  }, [topic, videoId]);

  // Highlight code when it changes
  useEffect(() => {
    Prism.highlightAll();
  }, [currentVideo, isMobile, activeCodeVideo]);

  // Smooth scroll to center code
  useEffect(() => {
    if (!activeCodeVideo) return;
    const el = codeRefs.current[activeCodeVideo];
    if (!el) return;

    let attempts = 0;
    const maxAttempts = 10;

    const scrollToCenter = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const middle = rect.top + window.scrollY - window.innerHeight / 2 + rect.height / 2;
      window.scrollTo({ top: middle, behavior: "smooth" });

      attempts++;
      if (attempts < maxAttempts && (rect.top < 0 || rect.bottom > window.innerHeight)) {
        setTimeout(scrollToCenter, 100);
      }
    };

    const timer = setTimeout(scrollToCenter, 50);
    return () => clearTimeout(timer);
  }, [activeCodeVideo]);

  // Loading skeleton
  if (parentLoading) {
    return (
      <div className="container py-4 text-center">
        <h4 className="mb-4">
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
      </div>
    );
  }

  if (!topic) return <p className="text-center mt-5">❌ Topic not found</p>;

  // MOBILE layout
  if (isMobile) {
    const mobileVideos = [...(topic.videos || [])].sort((a, b) => b.id - a.id);

    return (
      <div className="container py-4">
        <h3 className="text-center text-warning mb-4">🎬 {topic.name}</h3>
        <div className="video-main-wrapper">
          {mobileVideos.map((video) => {
            const isActive = currentVideo?.id === video.id;

            return (
              <div
                className={`video-wrapper mb-4 position-relative ${isActive ? "active-video-mobile" : ""}`}
                key={video.id}
                onClick={() => {
                  setCurrentVideo(video);
                  setActiveCodeVideo(null);
                  navigate(`/Frontend_Tutorial_Solution/${topicID}/${video.id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <div className="video-container-inner">
                  <video key={video.id} src={video.video_url} autoPlay loop muted playsInline />
                </div>

                {/* Description */}
                {video.info?.description && (
                  <p className="video-description text-light mt-2 mx-3">{video.info.description}</p>
                )}

                <div className="d-flex justify-content-center m-0">
                  <button
                    className="view-hide-code-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentVideo(video);
                      setActiveCodeVideo((prev) => (prev === video.id ? null : video.id));
                    }}
                  >
                    {activeCodeVideo === video.id ? "← Hide Code" : "View Code →"}
                  </button>
                </div>

                {activeCodeVideo === video.id && video.source_codes?.length > 0 && (
                  <div
                    className="code-info-wrapper mt-3"
                    ref={(el) => (codeRefs.current[video.id] = el)}
                  >
                    {video.source_codes.map((codeObj, idx) => (
                      <VideoCodeBox key={idx} codeObj={codeObj} videoId={video.id} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // DESKTOP layout
  if (!currentVideo) return <p className="text-center mt-5">Loading video...</p>;

  const relatedVideos = [...(topic.videos || [])]
    .sort((a, b) => b.id - a.id)
    .filter((v) => v.id !== currentVideo.id);

  return (
    <div className="container py-4">
      <h3 className="text-center text-warning mb-4">🎬 {topic.name}</h3>
      <div className="video-main-wrapper">
        <div className="video-wrapper">
          <div className="video-container-inner">
            <video key={currentVideo.id} src={currentVideo.video_url} autoPlay loop muted playsInline />
          </div>

          {/* Description */}
          {currentVideo.info?.description && (
            <p className="video-description text-light mt-2 mx-3">{currentVideo.info.description}</p>
          )}

          <div className="d-flex justify-content-center m-0">
            <button
              className="view-hide-code-btn"
              onClick={() =>
                setActiveCodeVideo((prev) => (prev === currentVideo.id ? null : currentVideo.id))
              }
            >
              {activeCodeVideo === currentVideo.id ? "← Hide Code" : "View Code →"}
            </button>
          </div>

          {activeCodeVideo === currentVideo.id && currentVideo.source_codes?.length > 0 && (
            <div
              className="code-info-wrapper mt-2"
              ref={(el) => (codeRefs.current[currentVideo.id] = el)}
            >
              {currentVideo.source_codes.map((codeObj, idx) => (
                <VideoCodeBox key={idx} codeObj={codeObj} videoId={currentVideo.id} />
              ))}
            </div>
          )}
        </div>

        <div className="related-videos">
          {relatedVideos.map((video) => (
            <div
              key={video.id}
              className="video-card"
              onClick={() => {
                setCurrentVideo(video);
                setActiveCodeVideo(null);
                navigate(`/Frontend_Tutorial_Solution/${topicID}/${video.id}`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
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

// VideoCodeBox component remains the same as before
const VideoCodeBox = React.memo(({ codeObj, videoId }) => {
  const codeRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState("html");
  const [adCompleted, setAdCompleted] = useState({ html: true, css: false, js: false });
  const navigate = useNavigate();

  useEffect(() => {
    if (codeRef.current) Prism.highlightElement(codeRef.current);
  }, [selectedTab, adCompleted]);

  const handleAdComplete = (tab) => setAdCompleted(prev => ({ ...prev, [tab]: true }));

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
      const promoMessage = `${commentStart}Code by CodeVerse. Visit official site: 'https://blog-code-verse.vercel.app' ${commentEnd}\n`;
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
          {["html", "css", "js"].map(tab => (
            <button
              key={tab}
              className={`btn-tab ${selectedTab === tab ? "active-tab" : ""}`}
              onClick={e => { e.stopPropagation(); setSelectedTab(tab); }}
            >
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
});

export default Frontend_Tutorial_Solution;
