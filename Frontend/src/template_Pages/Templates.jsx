import React, { useEffect, useState } from "react";
import { useTemplates } from "./Template_API.jsx";
import { useNavigate } from "react-router-dom";
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

  // Filter templates based on selected filters
  const filteredTemplates = templates.filter((t) => {
    const access = typeof t.access_type === "string" ? t.access_type : t.access_type?.name || "Free";
    const type = typeof t.template_type === "string" ? t.template_type : t.template_type?.name || "General";
    const price = t.price || 0;

    const matchAccess = filters.access === "All" || access === filters.access;
    const matchType = filters.type === "All" || type === filters.type;
    const matchPrice = filters.maxPrice == null || price <= filters.maxPrice;

    return matchAccess && matchType && matchPrice;
  });

  // Unique access types (strings)
  const accessTypes = ["All", ...Array.from(new Set(
    templates.map((t) => (typeof t.access_type === "string" ? t.access_type : t.access_type?.name))
  ))];

  // Unique template types (strings)
  const templateTypes = ["All", ...Array.from(new Set(
    templates.map((t) => (typeof t.template_type === "string" ? t.template_type : t.template_type?.name))
  ))];

  return (
    <div id="TEMPLATES" className="template-page">
      <h2 style={{ marginBottom: "20px" }}>Choose a Template</h2>

      {/* Filters */}
      <div className="template-filters">
        {/* Access Type */}
        <select
          onChange={(e) => setFilters({ ...filters, access: e.target.value })}
          value={filters.access}
        >
          {accessTypes.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        {/* Template Type */}
        <select
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          value={filters.type}
        >
          {templateTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Max Price */}
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice ?? ""}
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : null })
          }
        />
      </div>

      {/* Templates Grid */}
      <div className="list-and-view">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="tpl-item skeleton">
              <div className="tpl-placeholder skeleton-box"></div>
              <div className="tpl-info">
                <div className="skeleton-text"></div>
                <div className="tpl-badges">
                  <div className="skeleton-badge"></div>
                  <div className="skeleton-badge"></div>
                </div>
              </div>
            </div>
          ))
        ) : filteredTemplates.length === 0 ? (
          <p>No templates found.</p>
        ) : (
          filteredTemplates.map((t) => {
            const access = typeof t.access_type === "string" ? t.access_type : t.access_type?.name || "Free";
            const type = typeof t.template_type === "string" ? t.template_type : t.template_type?.name || "General";
            const price = t.price || 0;
            const title = t.title || "Untitled";

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
                  <div className="tpl-badges">
                    <span className={`badge ${access.toLowerCase()}`}>
                      {access}
                      {access === "Premium" && price ? ` • $${price}` : ""}
                    </span>
                    <span className="badge type-badge">{type}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Templates;
