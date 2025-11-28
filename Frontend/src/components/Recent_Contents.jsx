// src/components/Recent_Contents.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../assets/css/Recent_Contents.css";
import { Parent_API_Provider_Context } from "../context/Parent_API_Provider";

const buildIframeDoc = (html = "", css = "", js = "", aspectWidth = 320, aspectHeight = 450) => {
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

      /* Outer wrapper keeps everything perfectly centered */
      .scaleWrapper {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }

      /* Inner wrapper: actual scaled content */
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

        // Keep aspect ratio intact
        const scale = Math.min(
          availableWidth / naturalWidth,
          availableHeight / naturalHeight
        );

        // Apply scale without shifting visual center
        inner.style.transform = 'scale(' + scale + ')';
      }

      window.addEventListener('load', resizeScale);
      window.addEventListener('resize', resizeScale);
    </script>
  </body>
  </html>
  `;
};



function Recent_Contents() {
  const { data, loading, error } = useContext(Parent_API_Provider_Context);
  const navigate = useNavigate();

  if (loading) {
    return (
      <SkeletonTheme baseColor="#1c1c1c" highlightColor="#2a2a2a">
        <div className="row g-4">
          {[1, 2, 3].map((i) => (
            <div className="col-12 col-md-6 col-lg-4" key={i}>
              <div className="card shadow-sm border-0 rounded-4 overflow-hidden tutorial-card p-2">
                <Skeleton height={200} borderRadius={10} />
                <div className="card-body py-2">
                  <Skeleton width="70%" height={20} className="mb-2 mt-3" />
                  <Skeleton width="90%" height={14} count={2} />
                  <Skeleton width={100} height={30} borderRadius={20} className="mt-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SkeletonTheme>
    );
  }

  if (error) {
    return <p className="text-center text-danger py-5">Failed to load tutorials.</p>;
  }

  // Flatten topics -> source_codes
  const tutorials = (data || []).flatMap((category) =>
    (category.sections || []).flatMap((section) =>
      (section.languages || []).flatMap((language) =>
        (language.topics || []).flatMap((topic) => {
          const items = topic.source_codes || [];
          return (items || []).map((item) => {
            return {
              sourceId: item.id,
              topicId: topic.id,
              topicName: topic.name,
              title: item.title || topic.name,
              infoDesc: item.description || "",
              html: item.html_code || item.html || "",
              css: item.css_code || item.css || "",
              js: item.js_code || item.js || "",
              access_type: item.access_type || "Free",
            };
          });
        })
      )
    )
  );

  const sorted = tutorials.sort((a, b) => {
    const ai = Number(a.sourceId) || 0;
    const bi = Number(b.sourceId) || 0;
    return bi - ai;
  });

  const handleNavigate = (topicId, sourceId) => {
    navigate(`/Component-Designs/${topicId}/${sourceId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="g-4 recent-cards-container">
      {sorted.length === 0 ? (
        <p className="text-center text-muted py-5">No recent tutorials found.</p>
      ) : (
        sorted.slice(0, 6).map((t) => {
          const accessTypeString = (t.access_type || "").toString();
          const isPremium = accessTypeString.trim().toLowerCase() === "premium";
          const iframeDoc = buildIframeDoc(t.html, t.css, t.js);

          return (
            <div key={`${t.sourceId}-${t.topicId}`}>
              <div
                className="card shadow-sm border-0 rounded-4 overflow-hidden tutorial-card position-relative"
                onClick={(e) => { e.stopPropagation(); handleNavigate(t.topicId, t.sourceId); }}
                style={{ cursor: "pointer" }}
              >
                <div className="video-container position-relative">
                  <iframe
                    title={`preview-${t.sourceId}`}
                    srcDoc={iframeDoc}
                    className="iframe-preview"
                    sandbox="allow-scripts allow-same-origin"
                    style={{ height: 200, width: "100%", border: "none", display: "block" }}
                  />
                  {isPremium && (
                    <div className="premium-badge-top-right">
                      <div className="dollor-box-top-right">
                        <i className="bi bi-currency-dollar"></i>
                      </div>
                      PREMIUM
                    </div>
                  )}
                </div>

                <div className="card-body py-2">
                  <h5 className="recent-card-title">{t.topicName}</h5>
                  <button
                    className="btn btn-outline-warning btn-sm rounded-pill"
                    onClick={(e) => { e.stopPropagation(); handleNavigate(t.topicId, t.sourceId); }}
                  >
                    View Code →
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Recent_Contents;
