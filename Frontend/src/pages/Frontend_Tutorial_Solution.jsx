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

const Frontend_Tutorial_Solution = () => {
  const { topicID } = useParams();
  const topicId = parseInt(topicID);
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCode, setShowCode] = useState({});
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const mainVideoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        setCurrentVideo(res.data.videos[0]);
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
  }, [currentVideo, isMobile]);

  if (loading) {
    return (
      <div className="container py-4">
        <h4 className="text-center mb-4">
          <Skeleton width={250} height={25} />
        </h4>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="card video-card mb-5 p-2 shadow-lg rounded-4">
            <Skeleton height={250} borderRadius={20} />
          </div>
        ))}
      </div>
    );
  }

  if (!topic) return <p className="text-center mt-5">❌ Topic not found</p>;

  if (isMobile) {
    return (
      <div className="container py-4">
        <h3 className="text-center text-warning mb-4">🎬 {topic.name}</h3>
        <div className="video-main-wrapper">
          {topic.videos.map((video) => (
            <div className="video-wrapper mb-4 position-relative" key={video.id}>
              {(video.access_type === "Premium" ||
                video.source_codes.some(code => code.access_type === "Premium")) && (
                <div className="video-price-tag">$</div>
              )}

              <div className="video-container-inner">
                <video
                  key={video.id}
                  src={video.video_url}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>

              <div className="video-description text-white">
                <p className="mb-0 mt-2 mx-2">{video.info.description}</p>
              </div>

              <div className="d-flex justify-content-center m-0">
                <button
                  className="copy-btn"
                  onClick={() =>
                    setShowCode((prev) => ({ ...prev, [video.id]: !prev[video.id] }))
                  }
                >
                  {showCode[video.id] ? "Hide Code" : "View Code"}
                </button>
              </div>

              {showCode[video.id] && (
                <div className="code-info-wrapper mt-3">
                  {video.source_codes.map((codeObj, idx) => (
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

  return (
    <div className="container py-4">
      <h3 className="text-center text-warning mb-4">🎬 {topic.name}</h3>
      <div className="video-main-wrapper">
        <div className="video-wrapper" ref={mainVideoRef}>
          {(currentVideo.access_type === "Premium" || 
            currentVideo.source_codes.some(code => code.access_type === "Premium")) && (
            <div className="video-price-tag">$</div>
          )}

          <div className="video-container-inner">
            <video
              key={currentVideo?.id}
              src={currentVideo?.video_url}
              controls
              autoPlay
              loop
              muted
              playsInline
            />
          </div>

          <div className="video-description text-white">
            <p className="mb-0 mt-2 mx-2 py-2">{currentVideo?.info.description}</p>
          </div>

          <div className="d-flex justify-content-center m-0">
            <button
              className="copy-btn"
              onClick={() =>
                setShowCode((prev) => ({ ...prev, [currentVideo.id]: !prev[currentVideo.id] }))
              }
            >
              {showCode[currentVideo.id] ? "Hide Code" : "View Code"}
            </button>
          </div>

          {showCode[currentVideo.id] && (
            <div className="code-info-wrapper mt-2">
              {currentVideo.source_codes.map((codeObj, idx) => (
                <VideoCodeBox key={idx} codeObj={codeObj} />
              ))}
            </div>
          )}
        </div>

        <div className="related-videos">
          {topic.videos
            .filter((v) => v.id !== currentVideo.id)
            .map((video) => (
              <div
                key={video.id}
                className="video-card"
                onClick={() => {
                  setCurrentVideo(video);
                  setShowCode({});
                  mainVideoRef.current.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {(video.access_type === "Premium" ||
                  video.source_codes.some(code => code.access_type === "Premium")) && (
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

      // Add comment message depending on language
      const commentStart = selectedTab === "html" ? "<!-- " :
                          selectedTab === "css" ? "/* " : "// ";
      const commentEnd = selectedTab === "html" ? " -->" :
                         selectedTab === "css" ? " */" : "";

      const promoMessage = `${commentStart}Code by CodeVerse.\nvisit official site for more free designs and tutorial :\n :--- ' https://blog-code-verse.vercel.app ' ${commentEnd}\n`;

      const finalCode = `${promoMessage}${code}\n${promoMessage}`;
      navigator.clipboard.writeText(finalCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <button
        className={`copy-btn ${canViewCode ? "" : "disabled-copy-btn"}`}
        onClick={handleCopy}
        disabled={!canViewCode}
      >
        <FaCopy /> {copied ? "Copied!" : "Copy"}
      </button>
    );
  };

  return (
    <div className="card shadow-lg mb-1 d-flex flex-column h-100 position-relative">
      {/* Tabs + Copy */}
      <div className="card-header d-flex justify-content-between align-items-center position-relative">
        <div className="btn-group">
          {["html", "css", "js"].map((tab) => (
            <button
              key={tab}
              className={`btn-tab ${selectedTab === tab ? "active-tab" : ""}`}
              onClick={() => setSelectedTab(tab)}
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

      {/* Code Box */}
      <div className="card-body position-relative">
        {isPremium && !hasBought ? (
          <div className="code-wrapper">
            <pre className="scrollable-code">
              <code ref={codeRef} className={`language-${selectedTab}`}>
                {getCodeByTab(selectedTab)}
              </code>
            </pre>
            <div className="buy-btn-overlay">
              <button
                className="buy-premium-btn"
                onClick={() =>
                  navigate("/Payment_Page", { state: { sourceId: codeObj.id, amount: codeObj.price || 100 } })
                }
              >
                💳 Buy Premium Code
              </button>
            </div>
          </div>
        ) : isFree && !adCompleted[selectedTab] ? (
          <Ads_Container onComplete={() => handleAdComplete(selectedTab)} boxType={selectedTab} />
        ) : (
          <div className="code-wrapper">
            <pre>
              <code ref={codeRef} className={`language-${selectedTab}`}>
                {getCodeByTab(selectedTab)}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Frontend_Tutorial_Solution;
