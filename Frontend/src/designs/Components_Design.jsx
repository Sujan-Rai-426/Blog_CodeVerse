// src/components/Components_Design.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Parent_API_Provider_Context } from "../context/Parent_API_Provider.jsx";

import Design_Code from "./Design_code.jsx";      // your code viewer (Prism, copy, premium logic)
import Design_Preview from "./Design_Preview";    // simple wrapper that accepts srcDoc + device props
import "../assets/css/Components_Design.css";

/**
 * Utility: safely build iframe document from html/css/js
 * - only injects <script> if js exists and is non-empty
 * - escapes closing </script> inside the JS content
 */
const buildIframeDoc = (html = "", css = "", js = "") => {
  const trimmedJs = (js || "").toString().trim();
  const safeJs = trimmedJs ? trimmedJs.replace(/<\/script>/gi, "<\\/script>") : "";
  const scriptTag = safeJs
    ? `<script>
         try {
           ${safeJs}
         } catch (err) {
           console.error("Preview JS error:", err);
         }
       </script>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>html,body{margin:0;padding:0;width:100%;height:100%;} ${css || ""}</style>
</head>
<body>
  ${html || ""}
  ${scriptTag}
</body>
</html>`;
};

const deviceSizes = {
  desktop: { width: "100%", height: "600px" },
  tablet: { width: "768px", height: "600px" },
  mobile: { width: "375px", height: "667px" },
};

export default function Components_Design() {
  const { topicID, videoId } = useParams();
  const navigate = useNavigate();
  const { data, loading } = useContext(Parent_API_Provider_Context);

  // main state
  const [currentCodes, setCurrentCodes] = useState(null); // { html, css, js, title, access_type, price?, hasBought?, id }
  const [srcDoc, setSrcDoc] = useState("");
  const [device, setDevice] = useState("desktop");
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("preview"); // "preview" or "code"

  // refs for scrolling
  const previewRef = useRef(null);
  const codeRef = useRef(null);

  // -------------------------
  // 1) Resolve topic -> video -> source_code from Parent API data
  // -------------------------
  useEffect(() => {
    if (loading || !data) return;

    let foundTopic = null;
    // traverse categories -> sections -> languages -> topics
    for (const category of data) {
      for (const section of category.sections || []) {
        for (const language of section.languages || []) {
          const topic = language.topics?.find((t) => String(t.id) === String(topicID));
          if (topic) {
            foundTopic = topic;
            setRelatedVideos(topic.videos || []);
            break;
          }
        }
        if (foundTopic) break;
      }
      if (foundTopic) break;
    }

    if (!foundTopic) {
      // nothing found for topicID
      setCurrentCodes(null);
      return;
    }

    const foundVideo = videoId
      ? foundTopic.videos?.find((v) => String(v.id) === String(videoId))
      : foundTopic.videos?.[0];

    if (!foundVideo) {
      setCurrentCodes(null);
      return;
    }

    // get first source_code entry for this video
    const codeObj = foundVideo.source_codes?.[0];
    if (!codeObj) {
      setCurrentCodes(null);
      return;
    }

    // set required fields; include price/hasBought if your API provides them
    setCurrentCodes({
      html: codeObj.html_code || "",
      css: codeObj.css_code || "",
      js: codeObj.js_code || "",
      title: foundVideo.title || "Untitled",
      access_type: codeObj.access_type || "Free", // IMPORTANT: use source_code's access_type
      price: codeObj.price || 0,                  // if present
      hasBought: !!codeObj.hasBought,             // if present
      id: foundVideo.id,
    });
  }, [loading, data, topicID, videoId]);

  // -------------------------
  // 2) Build srcDoc for main preview whenever currentCodes change
  // -------------------------
  useEffect(() => {
    if (!currentCodes) return;
    setSrcDoc(buildIframeDoc(currentCodes.html, currentCodes.css, currentCodes.js));
  }, [currentCodes]);

  // -------------------------
  // 3) Device changes: simple setter
  // -------------------------
  const changeDevice = (d) => {
    if (!deviceSizes[d]) return;
    setDevice(d);
  };

  // -------------------------
  // 4) Scroll / activate sections (Preview / Code)
  // -------------------------
  const scrollToSection = (tab) => {
    setActiveTab(tab);
    // if ref exists, smooth scroll into view
    if (tab === "preview") {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      codeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // -------------------------
  // 5) Fullscreen open (open srcDoc in new tab)
  // -------------------------
  const openFullscreen = () => {
    const newWindow = window.open("", "_blank");
    if (!newWindow) return;
    newWindow.document.open();
    newWindow.document.write(srcDoc);
    newWindow.document.close();
  };

  // -------------------------
  // 6) Related card click -> navigate to same route with new video id
  // -------------------------
  const handleRelatedClick = (video) => {
    navigate(`/Frontend_Tutorial_Solution/${topicID}/${video.id}`);
    // react-router change triggers parent effect to reload currentCodes
    // scroll to top after navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -------------------------
  // 7) Loading / not found states
  // -------------------------
  if (!currentCodes && loading) return <div className="text-center p-6">Loading preview…</div>;
  if (!currentCodes && !loading) return <div className="text-center p-6">No preview available</div>;

  // -------------------------
  // 8) Render
  // -------------------------
  return (
    <div className="template-preview-container">
      {/* ---------- Card ---------- */}
      <div className="template-preview">
        {/* Header */}
        <div className="preview-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ margin: 0 }}>{currentCodes.title}</h3>
            <div className="access-info" style={{ marginTop: 6 }}>
              <span className={`badge ${currentCodes.access_type?.toLowerCase() || "free"}`}>
                {currentCodes.access_type}
                {currentCodes.access_type === "Premium" && currentCodes.price ? ` • $${currentCodes.price}` : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Navigator buttons (Preview, Code, device selectors) */}
        <div className="navigator-btns" style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="code-preview-open">
            <button className={`action-btn preview-btn ${activeTab === "preview" ? "active" : ""}`} onClick={() => scrollToSection("preview")}>
              <i className="bi bi-eye-fill"></i> Preview
            </button>
            <button className={`action-btn code-btn ${activeTab === "code" ? "active" : ""}`} onClick={() => scrollToSection("code")}>
              <i className="bi bi-code-slash"></i> Code
            </button>
          </div>

            {/* Big fullscreen (duplicate for convenience) */}
            <button className="action-btn fullscreen-btn" onClick={openFullscreen}>
              <i className="bi bi-arrows-fullscreen"></i> Fullscreen
            </button>
        </div>

        {/* ---------- CODE section ---------- */}
        <div ref={codeRef} style={{ display: activeTab === "code" ? "block" : "none", marginTop: 16 }}>
          {/* pass access_type, price and hasBought from the source_code to Design_Code */}
          <Design_Code
            html={currentCodes.html}
            css={currentCodes.css}
            js={currentCodes.js}
            access_type={currentCodes.access_type}
            price={currentCodes.price}
            hasBought={currentCodes.hasBought}
          />
        </div>

        {/* ---------- PREVIEW section ---------- */}
        <div ref={previewRef} style={{ display: activeTab === "preview" ? "block" : "none", marginTop: 12 }}>
          <Design_Preview srcDoc={srcDoc} device={device} changeDevice={changeDevice} />
        </div>
      </div>

      {/* ---------- Related videos grid (repeat(3,1fr)) ---------- */}
      <div className="related-videos-grid" style={{ marginTop: 20 }}>
        {relatedVideos
          .filter((v) => v.id !== currentCodes.id)
          .map((v) => {
            const codeObj = v.source_codes?.[0]; // may be undefined
            // build a small srcDoc preview for the related card; safe even if codeObj missing
            const smallSrcDoc = buildIframeDoc(codeObj?.html_code || "", codeObj?.css_code || "", codeObj?.js_code || "");

            return (
              <div
                key={v.id}
                className="related-video-item"
                onClick={() => handleRelatedClick(v)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") handleRelatedClick(v); }}
                style={{
                  position: "relative",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* small preview iframe — pointerEvents disabled so clicks fall through to card */}
                <iframe
                  srcDoc={smallSrcDoc}
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  title={v.title}
                  style={{ pointerEvents: "none", width: "100%", height: 180, border: "none", borderRadius: 8 }}
                />
                {/* clickable overlay (keeps visual focus accessible) */}
                <div style={{ position: "absolute", inset: 0, zIndex: 2 }} aria-hidden />
                <span style={{ padding: "0.5rem", textAlign: "center", background: "rgba(0,0,0,0.25)", color: "#fff", borderRadius: "0 0 8px 8px" }}>
                  {v.title}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
