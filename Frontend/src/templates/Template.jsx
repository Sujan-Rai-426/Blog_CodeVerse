// src/template/Template.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTemplates } from "./Template_API";
import Template_Code from "./Template_Code";
import Template_Preview from "./Template_Preview";
import Template_Documentation from "./Template_Documentation";
import "../assets/css/Template.css";

const Template = () => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [tab, setTab] = useState("preview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTemplate = async () => {
      const data = await fetchTemplates();
      const found = data.find((t) => t.id.toString() === id);
      setTemplate(found || null);
      setLoading(false);
    };
    loadTemplate();
  }, [id]);

  if (loading) return <div className="loading">Loading template...</div>;
  if (!template) return <div className="empty">Template not found.</div>;

  return (
    <div className="template-page">
      <div className="template-view">
        <div className="top-controls">

            {/* Header Buttoms */}
            <div className="tabs">
              <button className={tab === "preview" ? "active" : ""} onClick={() => setTab("preview")}>Preview</button>
              <button className={tab === "code" ? "active" : ""} onClick={() => setTab("code")}>View Code</button>
              <button className={tab === "docs" ? "active" : ""} onClick={() => setTab("docs")}>Documentation</button>
            </div>

            {/* FREE or PREMIUM badge */}
            <span className={`badge ${template.user_access.toLowerCase()}`}>
              {template.user_access}
              {template.user_access === "Premium" ? ` • $${template.price}` : ""}
            </span>
            
        </div>

        <div className="tab-content">
          {tab === "preview" && <Template_Preview template={template} />}
          {tab === "code" && <Template_Code template={template} />}
          {tab === "docs" && <Template_Documentation template={template} />}
        </div>
      </div>
    </div>
  );
};

export default Template;
