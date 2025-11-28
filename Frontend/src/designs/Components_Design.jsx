// src/components/Components_Design.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Parent_API_Provider_Context } from "../context/Parent_API_Provider";
import Design_Code from "./Design_code.jsx";
import Design_Preview from "./Design_Preview";
import "../assets/css/Components_Design.css";
import { FaArrowRight, FaGem } from "react-icons/fa";

// === Main frame iframe doc ===
const buildMainIframeDoc = (html = "", css = "", js = "") => {
  const trimmedJs = (js || "").toString().trim();
  const safeJs = trimmedJs ? trimmedJs.replace(/<\/script>/gi, "<\\/script>") : "";
  const scriptTag = safeJs
    ? `<script>try{${safeJs}}catch(err){console.error("Preview JS error:",err);}</script>`
    : "";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body style="margin:0;padding:0;width:100%;height:100%">
  <style>html,body{margin:0;padding:0;width:100%;height:100%;} ${css || ""}</style>
  ${html || ""}
  ${scriptTag}
</body>
</html>`;
};

// === Recommended / small frame iframe doc ===
const buildRecommendedIframeDoc = (html = "", css = "", js = "", aspectWidth = 320, aspectHeight = 450) => {
  const trimmedJs = (js || "").toString().trim();
  const safeJs = trimmedJs ? trimmedJs.replace(/<\/script>/gi, "<\\/script>") : "";

  return `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: transparent;
        overflow: hidden;
      }

      .scaleWrapper {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }

      .scaleInner {
        width: ${aspectWidth}px;
        height: ${aspectHeight}px;
        display: flex;
        justify-content: center;
        align-items: center;
        transform-origin: center center;
      }

      ${css || ""}
    </style>
  </head>
  <body>
    <div class="scaleWrapper">
      <div class="scaleInner" id="scaleInner">
        ${html || ""}
      </div>
    </div>

    <script>
      try {
        ${safeJs}
      } catch(err) {
        console.error("Preview JS error:", err);
      }

      function resizeScale() {
        const inner = document.getElementById("scaleInner");
        if (!inner) return;

        const naturalWidth = inner.offsetWidth;
        const naturalHeight = inner.offsetHeight;

        const availableWidth = window.innerWidth;
        const availableHeight = window.innerHeight;

        const scale = Math.min(
          availableWidth / naturalWidth,
          availableHeight / naturalHeight
        );

        inner.style.transform = 'scale(' + scale + ')';
      }

      window.addEventListener('load', resizeScale);
      window.addEventListener('resize', resizeScale);
    </script>
  </body>
  </html>
  `;
};


const deviceSizes = {
  desktop: { width: "100%", height: "600px" },
  tablet: { width: "768px", height: "600px" },
  mobile: { width: "375px", height: "667px" },
};

export default function Components_Design() {
  const { topicID, codeId } = useParams();
  const navigate = useNavigate();
  const { data, loading } = useContext(Parent_API_Provider_Context);

  const [currentCodes, setCurrentCodes] = useState(null);
  const [srcDoc, setSrcDoc] = useState("");
  const [device, setDevice] = useState("desktop");
  const [relatedItems, setRelatedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("preview");
  const previewRef = useRef(null);
  const codeRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");


  useEffect(() => {
    if (loading || !data) return;

    let foundTopic = null;
    for (const category of data) {
      for (const section of category.sections || []) {
        for (const language of section.languages || []) {
          const topic = language.topics?.find((t) => String(t.id) === String(topicID));
          if (topic) {
            foundTopic = topic;
            break;
          }
        }
        if (foundTopic) break;
      }
      if (foundTopic) break;
    }

    if (!foundTopic) {
      setCurrentCodes(null);
      setRelatedItems([]);
      return;
    }

    const items = foundTopic.source_codes || [];
    setRelatedItems(items);

    let chosenSource = codeId ? items.find(s => String(s.id) === String(codeId)) : null;
    if (!chosenSource && items.length > 0) chosenSource = items[0];
    if (!chosenSource) {
      setCurrentCodes(null);
      return;
    }

    setCurrentCodes({
      html: chosenSource.html_code || chosenSource.html || "",
      css: chosenSource.css_code || chosenSource.css || "",
      js: chosenSource.js_code || chosenSource.js || "",
      title: chosenSource.title || chosenSource.name || "Untitled",
      access_type: chosenSource.access_type || "Free",
      price: chosenSource.price || 0,
      hasBought: !!chosenSource.hasBought,
      id: chosenSource.id,
      topicId: foundTopic.id
    });
  }, [loading, data, topicID, codeId]);

  useEffect(() => {
    if (!currentCodes) return;
    setSrcDoc(buildMainIframeDoc(currentCodes.html, currentCodes.css, currentCodes.js));
  }, [currentCodes]);

  const changeDevice = (d) => {
    if (!deviceSizes[d]) return;
    setDevice(d);
  };

  const scrollToSection = (tab) => {
    setActiveTab(tab);
    if (tab === "preview") previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    else codeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openFullscreen = () => {
    const newWindow = window.open("", "_blank");
    if (!newWindow) return;
    newWindow.document.open();
    newWindow.document.write(srcDoc);
    newWindow.document.close();
  };

  const handleRelatedClick = (code) => {
    navigate(`/Component-Designs/${topicID}/${code.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!currentCodes && loading) return <div className="text-center p-6">Loading preview…</div>;
  if (!currentCodes && !loading) return <div className="text-center p-6">No preview available</div>;

  return (
    <div className="template-preview-container">
      <div className="template-preview">

        {/* === Page Header === */}
        <div className="preview-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div className="cd-header">
            <h3>{currentCodes.title}</h3>
            <p>{currentCodes.description}</p>
            <div className="access-info" style={{ marginTop: 6 }}>
              <span className={`badge ${currentCodes.access_type?.toLowerCase() || "free"}`}>
                {currentCodes.access_type}
                {currentCodes.access_type === "Premium" && currentCodes.price ? ` • $${currentCodes.price}` : ""}
              </span>
            </div>
          </div>
        </div>

        {/* === Navigation Buttons === */}
        <div className="navigator-btns" style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="code-preview-open">
            <button className={`action-btn preview-btn ${activeTab === "preview" ? "active" : ""}`} onClick={() => scrollToSection("preview")}>
              <i className="bi bi-eye-fill" /> Preview
            </button>
            <button className={`action-btn code-btn ${activeTab === "code" ? "active" : ""}`} onClick={() => scrollToSection("code")}>
              <i className="bi bi-code-slash" /> Code
            </button>
          </div>
          <button className="action-btn fullscreen-btn" onClick={openFullscreen}>
            <i className="bi bi-arrows-fullscreen" /> Fullscreen
          </button>
        </div>

        {/* === Code Section === */}
        <div ref={codeRef} style={{ display: activeTab === "code" ? "block" : "none", marginTop: 16 }}>
          <Design_Code
            html={currentCodes.html}
            css={currentCodes.css}
            js={currentCodes.js}
            access_type={currentCodes.access_type}
            price={currentCodes.price}
            hasBought={currentCodes.hasBought}
          />
        </div>

        {/* === Preview Section === */}
        <div ref={previewRef} style={{ display: activeTab === "preview" ? "block" : "none", marginTop: 12 }}>
          <Design_Preview srcDoc={srcDoc} device={device} changeDevice={changeDevice} />
        </div>

      </div>


    {/* === Related / Recommended Designs === */}
    <div className="related-topic-container">
          <h1 className="home-section-title"> - Recommended - </h1>
        {/* === Search Bar === */}
          <div className="cd-search-bar-wrapper" style={{ marginBottom: 12 }}>
            <i className="fa fa-search" />
            <input
              type="text"
              className="cd-search-bar"
              placeholder=" Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

        {/* === Filter Buttons === */}
          <div style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              className={`cd-filter-btns ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              <i className="fa fa-list" /> All
            </button>

            <button
              className={`cd-filter-btns ${activeFilter === "free" ? "active" : ""}`}
              onClick={() => setActiveFilter("free")}
            >
              <i className="fa fa-unlock" /> Free
            </button>

            <button
              className={`cd-filter-btns premium ${activeFilter === "premium" ? "active" : ""}`}
              onClick={() => setActiveFilter("premium")}
            >
              <i className="fa fa-star" /> Premium
            </button>

            <button
              className={`cd-filter-btns ${activeFilter === "latest" ? "active" : ""}`}
              onClick={() => setActiveFilter("latest")}
            >
              <i className="fa fa-clock" /> Latest
            </button>

            <button
              className={`cd-filter-btns ${activeFilter === "oldest" ? "active" : ""}`}
              onClick={() => setActiveFilter("oldest")}
            >
              <i className="fa fa-history" /> Oldest
            </button>

            <button
              className={`cd-filter-btns ${activeFilter === "unwatched" ? "active" : ""}`}
              onClick={() => setActiveFilter("unwatched")}
            >
              <i className="fa fa-eye-slash" /> Unwatched
            </button>

            <button className="cd-filter-btns" disabled>
              <i className="fa fa-heart" /> Favourite
            </button>

            <button className="cd-filter-btns" disabled>
              <i className="fa fa-chart-bar" /> Clicked
            </button>
          </div>


        {/* === Filtered / Searched Items And IFRAME === */}
          <div className="related-videos-grid">
              {relatedItems
                .filter((s) => s.id !== currentCodes.id)
                .filter((s) => {
                  if (!searchTerm) return true;
                  return (s.title || "").toLowerCase().includes(searchTerm.toLowerCase());
                })
                .filter((s) => {
                  if (activeFilter === "all") return true;
                  if (activeFilter === "free") return s.access_type === "Free";
                  if (activeFilter === "premium") return s.access_type === "Premium";
                  return true;
                })
                .sort((a, b) => {
                  if (activeFilter === "latest") return b.id - a.id;
                  if (activeFilter === "oldest") return a.id - b.id;
                  return 0;
                })
                .map((s) => {
                  const smallSrcDoc = buildRecommendedIframeDoc(
                    s.html_code || s.html || "",
                    s.css_code || s.css || "",
                    s.js_code || s.js || "",
                    320,
                    450
                  );

                  return (
                    <div
                      key={s.id}
                      className="related-video-item"
                      onClick={() => handleRelatedClick(s)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === "Enter") handleRelatedClick(s); }}
                      style={{ position: 'relative' }} // make container relative
                    >
                      {s.access_type === "Premium" && (
                        <div 
                          style={{ 
                            position: 'absolute', 
                            top: 8, 
                            right: 8, 
                            background: 'gold', 
                            color: '#000', 
                            padding: '2px 6px', 
                            borderRadius: '4px', 
                            fontSize: 12, 
                            fontWeight: 'bold', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 4,
                            zIndex: 10
                          }}
                        >
                          <FaGem /> &nbsp; ${s.price || 0}
                        </div>
                      )}

                      <iframe
                        srcDoc={smallSrcDoc}
                        sandbox="allow-scripts allow-forms allow-modals"
                        title={s.title || `related-${s.id}`}
                        style={{ width: "100%", height: 180, border: "none", borderRadius: 8 }}
                      />

                      <span> 
                        <FaArrowRight /> &nbsp; {s.title || "Untitled"}
                      </span>
                    </div>
                  );
                })}

          </div>
    </div>


    </div>
  );
}
