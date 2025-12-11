import React, { useEffect, useRef, useState } from "react";
import { useTemplates } from "./Template_API.jsx";
import { useNavigate } from "react-router-dom";
// import { Helmet } from 'react-helmet-async';
import "../assets/css/Template.css";
import { FaGem } from "react-icons/fa";

const Templates = () => {
  const { templates: apiTemplates, loading: apiLoading } = useTemplates();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    access: "All",
    type: "All Category",
    maxPrice: null
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (apiTemplates && apiTemplates.length > 0) {
      setTemplates(apiTemplates);
    }
    setLoading(apiLoading);
  }, [apiTemplates, apiLoading]);


  // ===========================
  // SCALE REAL LAPTOP FRAME
  // ===========================
  const iframeRefs = useRef({});
  const wrapperRefs = useRef({});

  const applyScale = () => {
    Object.keys(wrapperRefs.current).forEach((id) => {
      const wrapper = wrapperRefs.current[id];
      const iframe = iframeRefs.current[id];
      if (!wrapper || !iframe) return;

      const wrapperWidth = wrapper.offsetWidth;
      const scale = wrapperWidth / 1366; // laptop width

      iframe.style.transform = `scale(${scale})`;
    });
  };

  useEffect(() => {
    applyScale();
    window.addEventListener("resize", applyScale);

    return () => window.removeEventListener("resize", applyScale);
  }, [templates]);


  // ==========================
  // FILTERING
  // ==========================
  const filteredTemplates = templates.filter((t) => {
    const access = typeof t.access_type === "string"
      ? t.access_type
      : t.access_type?.name || "Free";

    const type = typeof t.template_type === "string"
      ? t.template_type
      : t.template_type?.name || "General";

    const price = t.price || 0;

    const matchAccess = filters.access === "All" || access === filters.access;
    const matchType = filters.type === "All Category" || type === filters.type;
    const matchPrice = filters.maxPrice == null || price <= filters.maxPrice;

    return matchAccess && matchType && matchPrice;
  });

  const accessTypes = ["All", ...Array.from(new Set(
    templates.map((t) =>
      typeof t.access_type === "string"
        ? t.access_type
        : t.access_type?.name
    )
  ))];

  const templateTypes = ["All Category", ...Array.from(new Set(
    templates.map((t) =>
      typeof t.template_type === "string"
        ? t.template_type
        : t.template_type?.name
    )
  ))];

  return (

    <>

        {/* // ===================== AMP ADS ===================== */}
        {/* <Helmet>
            <script 
              async 
              custom-element="amp-auto-ads"
              src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"
            />
        </Helmet> */}



        {/* // ===================== TEMPLATE ===================== */}
        <div id="TEMPLATES" className="template-page">


          {/* Filters */}
          <div className="template-filters">
            <select
              onChange={(e) => setFilters({ ...filters, access: e.target.value })}
              value={filters.access}
            >
              {accessTypes.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>

            <select
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              value={filters.type}
            >
              {templateTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice ?? ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  maxPrice: e.target.value ? Number(e.target.value) : null
                })
              }
            />
          </div>

          {/* Templates Grid */}
          <div className="templates-grid">
            {loading ? (
              <p>Loading...</p>
            ) : filteredTemplates.length === 0 ? (
              <p>No templates found.</p>
            ) : (
              filteredTemplates.map((t) => {
                const access = typeof t.access_type === "string"
                  ? t.access_type
                  : t.access_type?.name || "Free";

                const type = typeof t.template_type === "string"
                  ? t.template_type
                  : t.template_type?.name || "General";

                const title = t.title || "Untitled";

                return (
                  <div key={t.id} className="tpl-item">

                    {/* Laptop-style thumbnail iframe */}
                    <div
                      className="iframe-wrapper"
                      ref={(el) => (wrapperRefs.current[t.id] = el)}
                      onClick={() => navigate(`/Templates/Preview/${t.id}`)}
                    >
                      
                      {/* ⭐ PREMIUM BADGE TOP RIGHT */}
                      {access === "Premium" && (
                        <div className="tpl-premium-badge">
                          <FaGem className="tpl-gem-icon" /> &nbsp; ${t.price}
                        </div>
                      )}

                      <iframe
                        ref={(el) => (iframeRefs.current[t.id] = el)}
                        className="template-cover-iframe"
                        src={t.iframe_url}
                        title={title}
                      />
                    </div>

                    {/* Title */}
                    <div className="tpl-info" onClick={() => navigate(`/Templates/Preview/${t.id}`)}>
                        <div >
                            <strong>{title}</strong>
                        </div>

                        {/* View Code Button */}
                        <div className="view-code-btn" onClick={() => navigate(`/Templates/Preview/${t.id}`)} >
                            View Template →
                        </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

    </>
  );
};

export default Templates;
