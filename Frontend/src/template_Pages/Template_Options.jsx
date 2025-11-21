// src/template/Template_Options.jsx
import React, { useEffect, useState } from "react";
import { fetchTemplates } from "./Template_API";
import { useNavigate } from "react-router-dom";
import "../assets/css/Template_Options.css";

const Template_Options = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTemplates = async () => {
      const data = await fetchTemplates();
      setTemplates(data || []);
      setLoading(false);
    };
    loadTemplates();
  }, []);

  if (loading) return <div className="loading">Loading templates...</div>;

  return (
    <div className="template-page">
      <h2 style={{ marginBottom: "20px" }}>Choose a Template</h2>
      <div
        className="list-and-view"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
      >
        {templates.map((t) => {
          const userAccess = t?.user_access || "Free"; // default fallback
          const title = t?.title || "Untitled";
          const thumbnail = t?.thumbnail || "/default-thumbnail.png"; // optional default

          return (
            <div
              key={t.id}
              className="tpl-item"
              onClick={() => navigate(`/Templates/${t.id}`)}
            >
              <img src={thumbnail} alt={title} />
              <div className="tpl-info">
                <strong>{title}</strong>
                <span className={`badge ${userAccess.toLowerCase()}`}>
                  {userAccess}
                  {userAccess === "Premium" && t.price ? ` • $${t.price}` : ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Template_Options;
