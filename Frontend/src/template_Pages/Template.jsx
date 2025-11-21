// src/template_Pages/Template.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTemplates } from "./Template_API";
import Template_Preview from "./Template_Preview";
import "../assets/css/Template.css";

const Template = () => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
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

  if (loading) return <div>Loading template...</div>;
  if (!template) return <div>Template not found.</div>;

  return <Template_Preview template={template} />;
};

export default Template;
