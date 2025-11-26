// src/components/Components_Design.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Parent_API_Provider_Context } from "../context/Parent_API_Provider";
import Design_Code from "./Design_code.jsx";
import Design_Preview from "./Design_Preview";
import "../assets/css/Components_Design.css";

const buildIframeDoc = (html = "", css = "", js = "") => {
  const trimmedJs = (js || "").toString().trim();
  const safeJs = trimmedJs ? trimmedJs.replace(/<\/script>/gi, "<\\/script>") : "";
  const scriptTag = safeJs
    ? `<script>try{${safeJs}}catch(err){console.error("Preview JS error:",err);}</script>`
    : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head><body style="margin:0;padding:0;width:100%;height:100%"><style>html,body{margin:0;padding:0;width:100%;height:100%;} ${css || ""}</style>${html || ""}${scriptTag}</body></html>`;
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

  useEffect(() => {
    if (loading || !data) return;

    // find topic
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

    const items = foundTopic.source_codes || []; // NOTE: topic holds source_codes directly now
    setRelatedItems(items);

    // If codeId provided, find that source; else pick first source
    let chosenSource = null;
    if (codeId) {
      chosenSource = items.find(s => String(s.id) === String(codeId));
    }
    if (!chosenSource && items.length > 0) {
      chosenSource = items[0];
    }

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
    setSrcDoc(buildIframeDoc(currentCodes.html, currentCodes.css, currentCodes.js));
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


      {/* === Page Header [ Title + Access tyle --> Free or Premium ] ====== */}
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


      {/* ===== NAVIGATION BUTTONS [ Code + Preview + Full Screen ] ============ */}
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

          <div ref={previewRef} style={{ display: activeTab === "preview" ? "block" : "none", marginTop: 12 }}>
              <Design_Preview srcDoc={srcDoc} device={device} changeDevice={changeDevice} />
          </div>
        </div>



{/* ============ RELATED DESIGNS ============= */}
      <div className="related-topic-container">
          <h1 className="home-section-title" > - Recommended - </h1>
          <div className="related-videos-grid">

              {relatedItems
                  .filter((s) => s.id !== currentCodes.id)
                  .map((s) => {
                      const smallSrcDoc = buildIframeDoc(s.html_code || s.html || "", s.css_code || s.css || "", s.js_code || s.js || "");
                      return (
                          <div
                              key={s.id}
                              className="related-video-item"
                              onClick={() => handleRelatedClick(s)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => { if (e.key === "Enter") handleRelatedClick(s); }}
                              style={{ position: "relative", cursor: "pointer", display: "flex", flexDirection: "column" }}
                          >
                            <iframe
                                srcDoc={smallSrcDoc}
                                sandbox="allow-scripts allow-forms allow-modals"
                                title={s.title || `related-${s.id}`}
                                style={{ pointerEvents: "none", width: "100%", height: 180, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}
                            />
                          </div>
                      );
                  })}
          </div>
      </div>
    </div>
  );
}
