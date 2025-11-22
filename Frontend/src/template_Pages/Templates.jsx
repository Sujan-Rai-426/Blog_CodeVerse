// src/template_Pages/Templates.jsx
import React, { useEffect, useState } from "react";
import { useTemplates } from "./Template_API.jsx";
import {  useNavigate } from "react-router-dom";
import "../assets/css/Template.css";

const Templates = () => {
    const { templates: apiTemplates, loading: apiLoading } = useTemplates();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ access: "All", type: "All", maxPrice: null });
    const navigate = useNavigate();

    useEffect(() => {
      if (apiTemplates && apiTemplates.length > 0) {
        setTemplates(apiTemplates);
      }
      setLoading(apiLoading);
    }, [apiTemplates, apiLoading]);

    // Filtered templates
    const filteredTemplates = templates.filter((t) => {
      const matchAccess = filters.access === "All" || t.access_type === filters.access;
      const matchType = filters.type === "All" || t.template_type === filters.type;
      const matchPrice = filters.maxPrice == null || (t.price || 0) <= filters.maxPrice;
      return matchAccess && matchType && matchPrice;
    });

    if (loading) return <div className="loading">Loading templates...</div>;

    // Unique filter values
    const accessTypes = ["All", ...new Set(templates.map((t) => t.access_type))];
    const templateTypes = ["All", ...new Set(templates.map((t) => t.template_type))];

  return (
    <div id="TEMPLATES" className="template-page">
      <h2 style={{ marginBottom: "20px" }}>Choose a Template</h2>

      {/* =========== Filters =========== */}
      <div className="template-filters">
            <select onChange={(e) => setFilters({ ...filters, access: e.target.value })} value={filters.access}>
              {accessTypes.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>

            <select onChange={(e) => setFilters({ ...filters, type: e.target.value })} value={filters.type}>
              {templateTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice || ""}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : null })}
            />

      </div>

      {/* Templates Grid */}
      <div className="list-and-view">
        {filteredTemplates.length === 0 && <p>No templates found.</p>}
        {filteredTemplates.map((t) => {
          const userAccess = t.access_type || "Free";
          const title = t.title || "Untitled";
          const type = t.template_type || "General";

          return (
            <div
              key={t.id}
              className="tpl-item"
              onClick={() => navigate(`/Templates/${t.id}`)}
            >
              <div className="tpl-placeholder">
                <span>{title}</span>
              </div>

              <div className="tpl-info">
                {/* <strong>Click to View Template</strong> */}
                <div className="tpl-badges">
                  <span className={`badge ${userAccess.toLowerCase()}`}>
                    {userAccess}{userAccess === "Premium" && t.price ? ` • $${t.price}` : ""}
                  </span>
                  <span className="badge type-badge">{type}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Templates;
