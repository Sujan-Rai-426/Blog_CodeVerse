

// src/admin/Admin_Update_Data.jsx
import React, { useEffect, useState } from "react";
import { useAdmin } from "./Admin_API_Context.jsx";
import "../assets/css/Admin_Update_Data.css";
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import apiAdmin from "../config/apiAdmin.js"; 

const Admin_Update_Data = () => {
  // =================== Local State ===================
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [expandedSub, setExpandedSub] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("category");

  // =================== AdminProvider Data ===================
  const { cache, fetchResource, fetchNested, updateCacheList } = useAdmin();
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [topics, setTopics] = useState([]);
  const [frontend, setFrontend] = useState([]);
  const [backend, setBackend] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [templateTypes, setTemplateTypes] = useState([]);


  // =================== Fetch Data ===================
  const fetchData = async () => {
    setLoading(true);
    try {
      // Use cache if available
      if (cache.adminData) {
        const data = cache.adminData;
        setCategories(data.categories || []);
        setSections(data.sections || []);
        setLanguages(data.languages || []);
        setTopics(data.topics || []);
        setFrontend(data.frontend || []);
        setBackend(data.backend || []);
        setTemplates(data.templates || []);
        setTemplateTypes(data.templateTypes || []);
      } else {
        // Fetch all resources
        const [
          categoriesRes,
          sectionsRes,
          languagesRes,
          topicsRes,
          frontendRes,
          backendRes,
          templatesRes,
          templateTypesRes,
        ] = await Promise.all([
          fetchResource("categories"),
          fetchResource("sections"),
          fetchResource("languages"),
          fetchResource("topics"),
          fetchResource("frontend-source-codes"),
          fetchResource("backend-steps"),
          fetchResource("templates"),
          fetchResource("template-types"),
        ]);

        setCategories(categoriesRes || []);
        setSections(sectionsRes || []);
        setLanguages(languagesRes || []);
        setTopics(topicsRes || []);
        setFrontend(frontendRes || []);
        setBackend(backendRes || []);
        setTemplates(templatesRes || []);
        setTemplateTypes(templateTypesRes || []);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =================== Helpers ===================
const toggleSub = (id) => setExpandedSub((prev) => ({ ...prev, [id]: !prev[id] }));

    const handleEdit = (item, fields) => {
        setEditingId(item.id);
        const initialData = {};

        fields.forEach((f) => {
            if (f === "topic") {
                // Use topic ID for backend, will show name in dropdown
                initialData[f] = item.topic;
            } else if (f === "step_title") {
                initialData[f] = item.step_file_name ?? "";
            } else if (f === "template_type_id") {
                initialData[f] = item.template_type?.id ?? "";
            } else {
                initialData[f] = item[f] ?? "";
            }
        });
        setFormData(initialData);
    }


// =================== Handle Cancle ===================
  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

// =================== Handle Update ===================
  const handleUpdate = async (endpoint, id, setStateFn) => {
    try {
      setSavingId(id);
      const payload = { ...formData };

      // Normalize empty fields to null
      Object.keys(payload).forEach((key) => {
        if (payload[key] === "") payload[key] = null;
      });

      // Convert numeric fields
      ["language", "price"].forEach((field) => {
        if (payload[field] != null) payload[field] = Number(payload[field]);
      });

      // Validate access_type
      if (payload.access_type) {
        const type = payload.access_type.toLowerCase();
        if (type === "free") payload.access_type = "Free";
        else if (type === "premium") payload.access_type = "Premium";
        else {
          alert("Access type must be Free or Premium");
          setSavingId(null);
          return;
        }
      }

      // PATCH request using apiAdmin (handles token)
      const res = await apiAdmin.patch(`/api/${endpoint}/${id}/`, payload);

      setStateFn((prev) => prev.map((i) => (i.id === id ? res.data : i)));
      updateCacheList(endpoint, res.data, "update");
      handleCancel();
      alert("Updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Update failed! Check console.");
    } finally {
      setSavingId(null);
    }
  };

// =================== Handle Delete ===================
  const handleDelete = async (endpoint, id, setStateFn) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      // DELETE request using apiAdmin
      await apiAdmin.delete(`/api/${endpoint}/${id}/`);

      setStateFn((prev) => prev.filter((i) => i.id !== id));
      updateCacheList(endpoint, { id }, "delete");
      if (editingId === id) handleCancel();
      alert("Deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };


  // =================== Render Form Fields ===================
  const renderFormFields = (fields) =>
    fields.map((field) => {
      const multilineFields = [
        "step_source_code",
        "html_code",
        "css_code",
        "js_code",
        "documentation",
        "project_info",
        "description",
        "step_description",
      ];

      const selectFields = {
        category: categories,
        section: sections,
        language: languages,
        template_type: templateTypes,
        access_type: [
          { id: "Free", name: "Free" },
          { id: "Premium", name: "Premium" },
        ],
      };

      if (selectFields[field]) {
        return (
          <div key={field} style={{ marginBottom: "0.5rem" }}>
            <label>{field}</label>
            <select
              className="avd-input"
              value={formData[field] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
            >
              <option value="">Select {field}</option>
              {selectFields[field].map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        );
      }

      const isMultiline = multilineFields.includes(field);
      return (
        <div key={field} style={{ marginBottom: "0.5rem" }}>
          <label>{field}</label>
          {isMultiline ? (
            <textarea
              className="avd-input"
              value={formData[field] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
              rows={6}
              style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}
            />
          ) : (
            <input
              className="avd-input"
              value={formData[field] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
            />
          )}
        </div>
      );
    });



  // =================== Tabs Render Functions ===================

// =================== Render CATEGORY Tabs ===================
  const renderCategoryTab = () =>
    categories
      .slice()
      .sort((a, b) => b.id - a.id)
      .map((cat) => {
        const catSections = sections
          .filter((s) => s.category === cat.id)
          .slice()
          .sort((a, b) => b.id - a.id);

        return (
          <div key={cat.id} className="avd-card">
            <div className="avd-card-header" onClick={() => toggleSub(cat.id)}>
              <strong className="text-danger">{cat.name}</strong>
              {expandedSub[cat.id] ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expandedSub[cat.id] &&
              (catSections.length
                ? catSections.map((sec) => (
                    <div key={sec.id} className="avd-sub-card">
                      {editingId === sec.id ? (
                        <>
                          {renderFormFields(["name", "category"])}
                          <div className="avd-card-buttons">
                            <button
                              className="avd-save-btn"
                              onClick={() =>
                                handleUpdate("sections", sec.id, setSections)
                              }
                            >
                              {savingId === sec.id ? "Saving..." : "Save"}
                            </button>
                            <button
                              className="avd-cancel-btn"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p>{sec.name}</p>
                          <div className="avd-card-buttons">
                            <button
                              className="avd-edit-btn"
                              onClick={() => handleEdit(sec, ["name", "category"])}
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              className="avd-delete-btn"
                              onClick={() =>
                                handleDelete("sections", sec.id, setSections)
                              }
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                : "No Sections")}
          </div>
        );
      });

// =================== Render SECTION TAB ===================
  const renderSectionTab = () =>
    sections
      .slice()
      .sort((a, b) => b.id - a.id)
      .map((sec) => {
        const secLanguages = languages
          .filter((l) => l.section === sec.id)
          .slice()
          .sort((a, b) => b.id - a.id);

        return (
          <div key={sec.id} className="avd-card">
            <div className="avd-card-header" onClick={() => toggleSub(sec.id)}>
              <strong className="text-danger">{sec.name}</strong>
              {expandedSub[sec.id] ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expandedSub[sec.id] &&
              (secLanguages.length
                ? secLanguages.map((lang) => (
                    <div key={lang.id} className="avd-sub-card">
                      {editingId === lang.id ? (
                        <>
                          {renderFormFields(["name", "icon_class", "section"])}
                          <div className="avd-card-buttons">
                            <button
                              className="avd-save-btn"
                              onClick={() =>
                                handleUpdate("languages", lang.id, setLanguages)
                              }
                            >
                              {savingId === lang.id ? "Saving..." : "Save"}
                            </button>
                            <button
                              className="avd-cancel-btn"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p>
                            <b>Language :</b> {lang.name}
                          </p>
                          <div className="avd-card-buttons">
                            <button
                              className="avd-edit-btn"
                              onClick={() =>
                                handleEdit(lang, ["name", "icon_class", "section"])
                              }
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              className="avd-delete-btn"
                              onClick={() =>
                                handleDelete("languages", lang.id, setLanguages)
                              }
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                : "No Languages")}
          </div>
        );
      });

// =================== Render LANGUAGE TAB ===================
  const renderLanguageTab = () =>
    languages
      .slice()
      .sort((a, b) => b.id - a.id)
      .map((lang) => {
        const langTopics = topics
          .filter((t) => t.language === lang.id)
          .slice()
          .sort((a, b) => b.id - a.id);

        return (
          <div key={lang.id} className="avd-card">
            <div
              className="avd-card-header"
              onClick={() => toggleSub(lang.id)}
            >
              <strong className="text-danger">{lang.name}</strong>
              {expandedSub[lang.id] ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expandedSub[lang.id] &&
              (langTopics.length
                ? langTopics.map((topic) => (
                    <div key={topic.id} className="avd-sub-card">
                      {editingId === topic.id ? (
                        <>
                          {renderFormFields([
                            "name",
                            "language",
                            "section",
                            "category",
                          ])}
                          <div className="avd-card-buttons">
                            <button
                              className="avd-save-btn"
                              onClick={() =>
                                handleUpdate("topics", topic.id, setTopics)
                              }
                            >
                              {savingId === topic.id ? "Saving..." : "Save"}
                            </button>
                            <button
                              className="avd-cancel-btn"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p>
                            <b>Topic:</b> {topic.name}
                          </p>
                          <div className="avd-card-buttons">
                            <button
                              className="avd-edit-btn"
                              onClick={() =>
                                handleEdit(topic, [
                                  "name",
                                  "language",
                                  "section",
                                  "category",
                                ])
                              }
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              className="avd-delete-btn"
                              onClick={() =>
                                handleDelete("topics", topic.id, setTopics)
                              }
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                : "No Topics")}
          </div>
        );
      });

// =================== Render TOPIC TAB ===================
  const renderTopicTab = () =>
    languages
      .slice()
      .sort((a, b) => b.id - a.id)
      .map((lang) => {
        const langTopics = topics
          .filter((t) => t.language === lang.id)
          .slice()
          .sort((a, b) => b.id - a.id);

        return (
          <div key={lang.id} className="avd-card">
            {/* Language Header */}
            <div
              className="avd-card-header"
              onClick={() => toggleSub(`lang-${lang.id}`)}
              style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}
            >
              <strong className="text-danger">
                Language: <span style={{ fontStyle: "italic" }}>{lang.name}</span>
              </strong>
              {expandedSub[`lang-${lang.id}`] ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {expandedSub[`lang-${lang.id}`] &&
              (langTopics.length
                ? langTopics.map((topic) => {
                    const topicFrontend = frontend
                      .filter((f) => f.topic === topic.id)
                      .slice()
                      .sort((a, b) => b.id - a.id);

                    const topicBackend = backend
                      .filter((b) => b.topic === topic.id)
                      .slice()
                      .sort((a, b) => b.step_number - a.step_number);

                    return (
                      <div key={topic.id} className="avd-sub-card" style={{ marginTop: "10px" }}>
                        {/* Topic Header */}
                        <div
                          className="avd-card-header"
                          onClick={() => toggleSub(`topic-${topic.id}`)}
                          style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}
                        >
                          <strong className="text-info">Topic: {topic.name}</strong>
                          {expandedSub[`topic-${topic.id}`] ? <FaChevronUp /> : <FaChevronDown />}
                        </div>

                        {/* Components / Steps */}
                        {expandedSub[`topic-${topic.id}`] && (
                          <>
                              {/* Frontend  Components Designs */}
                            { topicFrontend.map((comp) => (
                                <div key={`fe-${comp.id}`} className="avd-sub-card">
                                    {editingId === comp.id ? (
                                      <>
                                        <label>Title</label>
                                        <input
                                          className="avd-input"
                                          value={formData.title || ""}
                                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                        <label>Description</label>
                                        <textarea
                                          className="avd-textarea"
                                          value={formData.description || ""}
                                          onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                          }
                                        />
                                        <label>HTML Code</label>
                                        <textarea
                                          className="avd-codearea"
                                          value={formData.html_code || ""}
                                          onChange={(e) => setFormData({ ...formData, html_code: e.target.value })}
                                        />
                                        <label>CSS Code</label>
                                        <textarea
                                          className="avd-codearea"
                                          value={formData.css_code || ""}
                                          onChange={(e) => setFormData({ ...formData, css_code: e.target.value })}
                                        />
                                        <label>JS Code</label>
                                        <textarea
                                          className="avd-codearea"
                                          value={formData.js_code || ""}
                                          onChange={(e) => setFormData({ ...formData, js_code: e.target.value })}
                                        />
                                        <label>Access Type</label>
                                        <select
                                          className="avd-input"
                                          value={formData.access_type || "Free"}
                                          onChange={(e) =>
                                            setFormData({ ...formData, access_type: e.target.value })
                                          }
                                        >
                                          <option value="Free">Free</option>
                                          <option value="Premium">Premium</option>
                                        </select>

                                        {/* Show Price Input only when Premium is selected */}
                                        {formData.access_type === "Premium" && (
                                          <>
                                            <label>Price (USD)</label>
                                            <input
                                              type="number"
                                              className="avd-input"
                                              min="1"
                                              value={formData.price || ""}
                                              onChange={(e) =>
                                                setFormData({ ...formData, price: Number(e.target.value) })
                                              }
                                            />
                                          </>
                                        )}

                                        <div className="avd-card-buttons">
                                          <button
                                            className="avd-save-btn"
                                            onClick={() => handleUpdate("frontend-source-codes", comp.id, setFrontend)}
                                          >
                                            {savingId === comp.id ? "Saving..." : "Save"}
                                          </button>
                                          <button className="avd-cancel-btn" onClick={handleCancel}>
                                            Cancel
                                          </button>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <p>
                                          <b>{comp.title}</b> - {comp.access_type === "Premium" ? `$${comp.price} Premium` : "Free"}
                                        </p>
                                        <div className="avd-card-buttons">
                                          <button
                                            className="avd-edit-btn"
                                            onClick={() =>
                                              handleEdit(comp, [
                                                "title",
                                                "description",
                                                "html_code",
                                                "css_code",
                                                "js_code",
                                                "access_type",
                                                "price",
                                              ])
                                            }
                                          >
                                            <FaEdit /> Edit
                                          </button>
                                          <button
                                            className="avd-delete-btn"
                                            onClick={() => handleDelete("frontend-source-codes", comp.id, setFrontend)}
                                          >
                                            <FaTrash /> Delete
                                          </button>
                                        </div>
                                      </>
                                    )}
                                </div>
                              ))
                            }

                              {/* Backend / Code - Guide Steps */}
                            { topicBackend.map((step) => (
                                <div key={`be-${step.id}`} className="avd-sub-card" style={{ borderLeft: "3px solid #ccc", marginTop: "5px" }}>
                                  {editingId === step.id ? (
                                    <>
                                      <label>Step Number</label>
                                      <input
                                        type="number"
                                        className="avd-input"
                                        value={formData.step_number || ""}
                                        onChange={(e) =>
                                          setFormData({ ...formData, step_number: Number(e.target.value) })
                                        }
                                      />
                                      <label>Title / File Name</label>
                                      <input
                                        type="text"
                                        className="avd-input"
                                        value={formData.step_file_name || ""}
                                        onChange={(e) =>
                                          setFormData({ ...formData, step_file_name: e.target.value })
                                        }
                                      />
                                      <label>Description</label>
                                      <textarea
                                        className="avd-textarea"
                                        value={formData.step_description || ""}
                                        onChange={(e) =>
                                          setFormData({ ...formData, step_description: e.target.value })
                                        }
                                      />
                                      <label>Source Code</label>
                                      <textarea
                                        className="avd-codearea"
                                        value={formData.step_source_code || ""}
                                        onChange={(e) =>
                                          setFormData({ ...formData, step_source_code: e.target.value })
                                        }
                                      />
                                      <div className="avd-card-buttons">
                                        <button
                                          className="avd-save-btn"
                                          onClick={() =>
                                            handleUpdate("backend-steps", step.id, setBackend)
                                          }
                                        >
                                          {savingId === step.id ? "Saving..." : "Save"}
                                        </button>
                                        <button className="avd-cancel-btn" onClick={handleCancel}>
                                          Cancel
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-success">
                                        <b>Step {step.step_number}:</b> {step.step_file_name}
                                      </p>
                                      <pre className="avd-code-block text-gray">{step.step_description}</pre>
                                      <pre className="avd-code-editor">{step.step_source_code}</pre>
                                      <div className="avd-card-buttons">
                                        <button
                                          className="avd-edit-btn"
                                          onClick={() =>
                                            handleEdit(step, [
                                              "step_number",
                                              "step_file_name",
                                              "step_description",
                                              "step_source_code",
                                            ])
                                          }
                                        >
                                          <FaEdit /> Edit
                                        </button>
                                        <button
                                          className="avd-delete-btn"
                                          onClick={() =>
                                            handleDelete("backend-steps", step.id, setBackend)
                                          }
                                        >
                                          <FaTrash /> Delete
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))
                            }
                          </>
                        )}

                      </div>
                    );
                  })
                : "No Topics")}
          </div>
        )
      });

// =================== Render BACKEND TAB ===================
  const renderCodeGuideTab = () => {
    if (!backend.length || !topics.length) return <p>No Backend Steps</p>;

    // Group steps by topic
    const stepsByTopic = backend.reduce((acc, step) => {
      if (!acc[step.topic]) acc[step.topic] = [];
      acc[step.topic].push(step);
      return acc;
    }, {});

    return Object.keys(stepsByTopic)
      .sort((a, b) => b - a) // Sort topics descending by id
      .map((topicId) => {
        const topic = topics.find((t) => t.id === Number(topicId));
        const sortedSteps = stepsByTopic[topicId].slice().sort((a, b) => a.step_number - b.step_number);

        return (
          <div key={topicId} className="avd-card">
            {/* Topic Header */}
            <div
              className="avd-card-header"
              onClick={() => toggleSub(`topic-${topicId}`)}
              style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}
            >
              <strong className="text-info">
                Topic: {topic ? topic.name : "Unknown Topic"}
              </strong>
              {expandedSub[`topic-${topicId}`] ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {/* Steps under this topic */}
            {expandedSub[`topic-${topicId}`] &&
              sortedSteps.map((step) => (
                <div key={step.id} className="avd-sub-card">
                  {editingId === step.id ? (
                    <>
                      {/* Edit Mode */}
                      {renderFormFields([
                        "step_title",
                        "step_number",
                        "step_description",
                        "step_source_code",
                      ])}
                      <div className="avd-card-buttons">
                        <button
                          className="avd-save-btn"
                          onClick={() => handleUpdate("backend-steps", step.id, setBackend)}
                        >
                          {savingId === step.id ? "Saving..." : "Save"}
                        </button>
                        <button className="avd-cancel-btn" onClick={handleCancel}>
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Display Mode */}
                      <p>
                        <b>
                          Step.{step.step_number} &nbsp; <b className="text-success"> [{ step.step_file_name}]</b>
                        </b>
                      </p>
                      <pre className="avd-code-block text-gray">{step.step_description}</pre>
                      <pre className="avd-code-editor">{step.step_source_code}</pre>

                      <div className="avd-card-buttons">
                        <button
                          className="avd-edit-btn"
                          onClick={() =>
                            handleEdit(step, [
                              "step_title",
                              "step_number",
                              "step_description",
                              "step_source_code",
                            ])
                          }
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="avd-delete-btn"
                          onClick={() => handleDelete("backend-steps", step.id, setBackend)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
          </div>
        );
      });
  };


// =================== Render TEMPLATE TYPES TAB ===================
  const renderTemplateTypesTab = () => {
    if (!templateTypes.length) return <p>No Template Types</p>;

    return templateTypes
      .slice()
      .sort((a, b) => b.id - a.id) // latest types first
      .map((tt) => {
        // Filter templates belonging to this template type
        const ttTemplates = templates
          .filter((t) => t.template_type?.id === tt.id)
          .slice()
          .sort((a, b) => b.id - a.id); // latest templates first

        return (
          <div key={tt.id} className="avd-card">
            {/* Template Type Header */}
            <div className="avd-card-header" onClick={() => toggleSub(tt.id)}>
              <strong className="text-danger">{tt.name}</strong>
              {expandedSub[tt.id] ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {/* Templates under this type */}
            {expandedSub[tt.id] &&
              (ttTemplates.length ? (
                ttTemplates.map((tpl) => (
                  <div key={tpl.id} className="avd-sub-card">
                    {editingId === tpl.id ? (
                      <>
                        {/* Edit Mode */}
                        <label>Title</label>
                        <input
                          type="text"
                          className="avd-input"
                          value={formData.title || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                        />

                        <label>Project Info</label>
                        <textarea
                          className="avd-textarea"
                          value={formData.project_info || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, project_info: e.target.value })
                          }
                        />

                        <label>Iframe URL</label>
                        <input
                          type="text"
                          className="avd-input"
                          value={formData.iframe_url || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, iframe_url: e.target.value })
                          }
                        />

                        <label>Download Repo URL</label>
                        <input
                          type="text"
                          className="avd-input"
                          value={formData.download_repo_url || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, download_repo_url: e.target.value })
                          }
                        />

                        <label>Documentation URL</label>
                        <input
                          type="text"
                          className="avd-input"
                          value={formData.documentation || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, documentation: e.target.value })
                          }
                        />

                        <label>Template Type</label>
                        <select
                          className="avd-input"
                          value={formData.template_type_id || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              template_type_id: Number(e.target.value),
                            })
                          }
                        >
                          <option value="">Select Type</option>
                          {templateTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>

                        <label>Access Type</label>
                        <select
                          className="avd-input"
                          value={formData.access_type || "Free"}
                          onChange={(e) =>
                            setFormData({ ...formData, access_type: e.target.value })
                          }
                        >
                          <option value="Free">Free</option>
                          <option value="Premium">Premium</option>
                        </select>

                        {formData.access_type === "Premium" && (
                          <>
                            <label>Price (USD)</label>
                            <input
                              type="number"
                              className="avd-input"
                              min="1"
                              value={formData.price || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  price: Number(e.target.value),
                                })
                              }
                            />
                          </>
                        )}

                        <div className="avd-card-buttons">
                          <button
                            className="avd-save-btn"
                            onClick={() => handleUpdate("templates", tpl.id, setTemplates)}
                          >
                            {savingId === tpl.id ? "Saving..." : "Save"}
                          </button>
                          <button className="avd-cancel-btn" onClick={handleCancel}>
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Display Mode */}
                        <p className="m-0 text-info">
                          <b>{tpl.title}</b> - {tpl.project_info}
                        </p>
                        <p className="m-0 text-gray">
                          Type: {tpl.template_type?.name || "No Type"} |{" "}
                          {tpl.access_type === "Premium"
                            ? `$${tpl.price} Premium`
                            : "Free"}
                        </p>
                        <p className="text-gray">
                          <a href={tpl.iframe_url} target="_blank" rel="noreferrer">
                            Iframe URL
                          </a>{" "}
                          |{" "}
                          {tpl.download_repo_url && (
                            <a href={tpl.download_repo_url} target="_blank" rel="noreferrer">
                              Repo
                            </a>
                          )}{" "}
                          |{" "}
                          {tpl.documentation && (
                            <a href={tpl.documentation} target="_blank" rel="noreferrer">
                              Docs
                            </a>
                          )}
                        </p>
                        <div className="avd-card-buttons">
                          <button
                            className="avd-edit-btn"
                            onClick={() =>
                              handleEdit(tpl, [
                                "title",
                                "project_info",
                                "iframe_url",
                                "download_repo_url",
                                "documentation",
                                "access_type",
                                "price",
                                "template_type_id",
                              ])
                            }
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            className="avd-delete-btn"
                            onClick={() => handleDelete("templates", tpl.id, setTemplates)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ padding: "10px" }}>No Templates</p>
              ))}
          </div>
        );
      });
  };


  // =================== MAIN RENDER ===================
  return (
    <div className="avd-dashboard">
      {loading ? (
        <p>Loading admin data...</p>
      ) : (
        <>
          <div className="avd-tabs">
            {[
              "category",
              "section",
              "language",
              "topic",
              "backend",
              "template",
            ].map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="avd-tab-content">
            {activeTab === "category" && categories.length && renderCategoryTab()}
            {activeTab === "section" && sections.length && renderSectionTab()}
            {activeTab === "language" && languages.length && renderLanguageTab()}
            {activeTab === "topic" && topics.length && renderTopicTab()}
            {activeTab === "backend" && backend.length && renderCodeGuideTab()}
            {activeTab === "template" && templateTypes.length && renderTemplateTypesTab()}
          </div>
        </>
      )}
    </div>
  );
};

export default Admin_Update_Data;
