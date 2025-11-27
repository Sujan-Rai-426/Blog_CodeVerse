import React, { useEffect, useState } from "react";
import Admin_API from "./Admin_API";
import "../assets/css/Admin_View_Data.css";
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";

const Admin_View_Data = () => {
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [expandedSub, setExpandedSub] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("category");

  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [topics, setTopics] = useState([]);
  const [frontend, setFrontend] = useState([]);
  const [backend, setBackend] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [templateTypes, setTemplateTypes] = useState([]);
  const sortedCategories = [...categories].sort((a, b) => b.id - a.id);



// <------------- [ Handle FETCH DATA from Admin_API ] ------------->
  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        catRes,
        secRes,
        langRes,
        topicRes,
        frontRes,
        backRes,
        templateRes,
        templateTypesRes,
      ] = await Promise.all([
        Admin_API.get("/api/categories/"),
        Admin_API.get("/api/sections/"),
        Admin_API.get("/api/languages/"),
        Admin_API.get("/api/topics/"),
        Admin_API.get("/api/frontendsourcecodes/"),
        Admin_API.get("/api/backendsteps/"),
        Admin_API.get("/api/templates/"),
        Admin_API.get("/api/template-types/"),
      ]);

      setCategories(catRes.data || []);
      setSections(secRes.data || []);
      setLanguages(langRes.data || []);
      setTopics(topicRes.data || []);
      setFrontend(frontRes.data || []);
      setBackend(backRes.data || []);
      setTemplates(templateRes.data || []);
      setTemplateTypes(templateTypesRes.data || []);
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

  const toggleSub = (id) =>
    setExpandedSub((prev) => ({ ...prev, [id]: !prev[id] }));


// <------------- [ Handle EDIT ] ------------->
  const handleEdit = (item, fields) => {
    setEditingId(item.id);
    const initialData = {};
    fields.forEach((f) => {
      initialData[f] = item[f] ?? "";
    });
    setFormData(initialData);
  };


// <------------- [ Handle CANCEL ] ------------->
  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };


// <------------- [ Handle UPDATE ] ------------->
  const handleUpdate = async (endpoint, id, setStateFn) => {
    try {
      setSavingId(id);

      const payload = { ...formData };

      // Clean empty strings
      Object.keys(payload).forEach((key) => {
        if (payload[key] === "") payload[key] = null;
      });

      // Convert numeric/foreign key fields
      const fkFields = [
        "category",
        "section",
        "language",
        "template_type_id",
        "step_number",
        "price",
      ];
      fkFields.forEach((f) => {
        if (payload[f] != null) payload[f] = Number(payload[f]);
      });

      const res = await Admin_API.patch(`/api/${endpoint}/${id}/`, payload);
      setStateFn((prev) => prev.map((i) => (i.id === id ? res.data : i)));
      handleCancel();
      alert("Updated successfully");
    } catch (err) {
      console.error(err.response || err);
      alert("Update failed. Check console for details.");
    } finally {
      setSavingId(null);
    }
  };


// <------------- [ Handle DELETE ] ------------->
  const handleDelete = async (endpoint, id, setStateFn) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await Admin_API.delete(`/api/${endpoint}/${id}/`);
      setStateFn((prev) => prev.filter((i) => i.id !== id));
      if (editingId === id) handleCancel();
      alert("Deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };




  // <<<<===== Render Form Fields ===== >>>>
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
        template_type_id: templateTypes,
      };

      // Select fields
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


// =========== CATEGORY RENDER with -> { sections } ===============
const renderCategoryTab = () =>
  categories
    .slice()
    .sort((a, b) => b.id - a.id) // Latest category first
    .map((cat) => {
      const catSections = sections
        .filter((s) => s.category === cat.id)
        .slice()
        .sort((a, b) => b.id - a.id); // Latest section first
      return (
        <div key={cat.id} className="avd-card">
          <div className="avd-card-header" onClick={() => toggleSub(cat.id)}>
            <strong>{cat.name}</strong>
            {expandedSub[cat.id] ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSub[cat.id] &&
            (catSections.length ? (
              catSections.map((sec) => (
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
                        <button className="avd-cancel-btn" onClick={handleCancel}>
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
            ) : (
              "No Sections"
            ))}
        </div>
      );
    });



// =========== SECTION RENDER with -> { languages } ===============
const renderSectionTab = () =>
  sections
    .slice()
    .sort((a, b) => b.id - a.id) // Latest section first
    .map((sec) => {
      const secLanguages = languages
        .filter((l) => l.section === sec.id)
        .slice()
        .sort((a, b) => b.id - a.id); // Latest language first
      return (
        <div key={sec.id} className="avd-card">
          <div className="avd-card-header" onClick={() => toggleSub(sec.id)}>
            <strong>{sec.name}</strong>
            {expandedSub[sec.id] ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSub[sec.id] &&
            (secLanguages.length ? (
              secLanguages.map((lang) => (
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
                        <button className="avd-cancel-btn" onClick={handleCancel}>
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>{lang.name}</p>
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
            ) : (
              "No Languages"
            ))}
        </div>
      );
    });



// =========== LANGUAGE RENDER with -> { topics } ===============
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
            <div className="avd-card-header" onClick={() => toggleSub(lang.id)}>
              <strong>{lang.name}</strong>
              {expandedSub[lang.id] ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expandedSub[lang.id] &&
              (langTopics.length ? (
                langTopics.map((topic) => (
                  <div key={topic.id} className="avd-sub-card">
                    {editingId === topic.id ? (
                      <>
                        {renderFormFields(["name", "language", "section", "category"])}
                        <div className="avd-card-buttons">
                          <button
                            className="avd-save-btn"
                            onClick={() => handleUpdate("topics", topic.id, setTopics)}
                          >
                            {savingId === topic.id ? "Saving..." : "Save"}
                          </button>
                          <button className="avd-cancel-btn" onClick={handleCancel}>
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>{topic.name}</p>
                        <div className="avd-card-buttons">
                          <button
                            className="avd-edit-btn"
                            onClick={() =>
                              handleEdit(topic, ["name", "language", "section", "category"])
                            }
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            className="avd-delete-btn"
                            onClick={() => handleDelete("topics", topic.id, setTopics)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                "No Topics"
              ))}
          </div>
        );
      });



// =========== TOPIC RENDER with -> { components grouped by topic + language } ===============
  const renderTopicTab = () => {
    if (!languages.length || !topics.length) return null;
    return languages
      .slice()
      .sort((a, b) => b.id - a.id) // Latest language first
      .map((lang) => {
        // Get topics under this language
        const langTopics = topics
          .filter((t) => t.language === lang.id)
          .slice()
          .sort((a, b) => b.id - a.id); // Latest topic first

        // Always return the language card, even if no topics
        return (
          <div key={lang.id} className="avd-card">
            {/* Language Header */}
            <div
              className="avd-card-header"
              onClick={() => toggleSub(`lang-${lang.id}`)}
              style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}
            >
              <strong>
                Language: <span style={{ fontStyle: "italic" }}>{lang.name}</span>
              </strong>
              {expandedSub[`lang-${lang.id}`] ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {/* Topics under this language */}
            {expandedSub[`lang-${lang.id}`] &&
              (langTopics.length ? (
                langTopics.map((topic) => {
                  const topicComponents = frontend
                    .filter((f) => f.topic === topic.id)
                    .slice()
                    .sort((a, b) => b.id - a.id); // Latest component first

                  return (
                    <div key={topic.id} className="avd-sub-card" style={{ marginTop: "10px" }}>
                      {/* Topic Header */}
                      <div
                        className="avd-card-header"
                        onClick={() => toggleSub(`topic-${topic.id}`)}
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <strong>{topic.name}</strong>
                        {expandedSub[`topic-${topic.id}`] ? <FaChevronUp /> : <FaChevronDown />}
                      </div>

                      {/* Components under topic */}
                      {expandedSub[`topic-${topic.id}`] &&
                        (topicComponents.length ? (
                          topicComponents.map((comp) => (
                            <div key={comp.id} className="avd-sub-card">
                              {editingId === comp.id ? (
                                <>
                                  {/* FULL UPDATE FIELDS */}
                                  <label>Title</label>
                                  <input
                                    className="avd-input"
                                    value={formData.title || ""}
                                    onChange={(e) =>
                                      setFormData({ ...formData, title: e.target.value })
                                    }
                                  />

                                  <label>Language</label>
                                  <select
                                    className="avd-input"
                                    value={formData.language || ""}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        language: Number(e.target.value),
                                      })
                                    }
                                  >
                                    <option value="">Select Language</option>
                                    {languages.map((l) => (
                                      <option key={l.id} value={l.id}>
                                        {l.name}
                                      </option>
                                    ))}
                                  </select>

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
                                    onChange={(e) =>
                                      setFormData({ ...formData, html_code: e.target.value })
                                    }
                                  />

                                  <label>CSS Code</label>
                                  <textarea
                                    className="avd-codearea"
                                    value={formData.css_code || ""}
                                    onChange={(e) =>
                                      setFormData({ ...formData, css_code: e.target.value })
                                    }
                                  />

                                  <label>JS Code</label>
                                  <textarea
                                    className="avd-codearea"
                                    value={formData.js_code || ""}
                                    onChange={(e) =>
                                      setFormData({ ...formData, js_code: e.target.value })
                                    }
                                  />

                                  <label>Documentation</label>
                                  <textarea
                                    className="avd-textarea"
                                    value={formData.documentation || ""}
                                    onChange={(e) =>
                                      setFormData({ ...formData, documentation: e.target.value })
                                    }
                                  />

                                  <div className="avd-card-buttons">
                                    <button
                                      className="avd-save-btn"
                                      onClick={() =>
                                        handleUpdate("frontendsourcecodes", comp.id, setFrontend)
                                      }
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
                                  <p>{comp.title}</p>
                                  <div className="avd-card-buttons">
                                    <button
                                      className="avd-edit-btn"
                                      onClick={() =>
                                        handleEdit(comp, [
                                          "title",
                                          "language",
                                          "description",
                                          "html_code",
                                          "css_code",
                                          "js_code",
                                          "documentation",
                                        ])
                                      }
                                    >
                                      <FaEdit /> Edit
                                    </button>
                                    <button
                                      className="avd-delete-btn"
                                      onClick={() =>
                                        handleDelete("frontendsourcecodes", comp.id, setFrontend)
                                      }
                                    >
                                      <FaTrash /> Delete
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))
                        ) : (
                          <p style={{ padding: "10px" }}>No Components</p>
                        ))}
                    </div>
                  );
                })
              ) : (
                <p style={{ padding: "10px" }}>No Topics</p>
              ))}
          </div>
        );
      });
  };



// =========== Code Guide / BACKEND RENDER grouped by Language & Topic ===============
  const renderCodeGuideTab = () => {
    if (!backend.length || !topics.length || !languages.length) return null;

    const backendByLanguage = backend.reduce((acc, step) => {
      const topicObj = topics.find((t) => t.id === step.topic);
      if (!topicObj) return acc;

      const langId = topicObj.language;
      if (!acc[langId]) acc[langId] = [];
      acc[langId].push(step);

      return acc;
    }, {});

    return Object.keys(backendByLanguage)
      .sort((a, b) => b - a) // descending language ids
      .map((langId) => {
        const language = languages.find((l) => l.id === Number(langId));

        const stepsByTopic = backendByLanguage[langId].reduce((acc, step) => {
          if (!acc[step.topic]) acc[step.topic] = [];
          acc[step.topic].push(step);
          return acc;
        }, {});

        return (
          <div key={langId} className="avd-card">
            <div
              className="avd-card-header"
              onClick={() => toggleSub(`lang-${langId}`)}
              style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}
            >
              <strong>
                Language:{" "}
                <span style={{ fontStyle: "italic" }}>
                  {language ? language.name : "Unknown Language"}
                </span>
              </strong>
              {expandedSub[`lang-${langId}`] ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {expandedSub[`lang-${langId}`] &&
              Object.keys(stepsByTopic)
                .sort((a, b) => b - a) // descending topic ids
                .map((topicId) => {
                  const topic = topics.find((t) => t.id === Number(topicId));

                  const sortedSteps = stepsByTopic[topicId]
                    .slice()
                    .sort((a, b) => b.step_number - a.step_number); // latest steps first

                  return (
                    <div key={topicId} className="avd-sub-card" style={{ marginTop: "10px" }}>
                      <div
                        className="avd-card-header"
                        onClick={() => toggleSub(`topic-${topicId}`)}
                        style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}
                      >
                        <strong>
                          Backend Topic: {topic ? topic.name : "Unknown Topic"}{" "}
                          {language && <span style={{ fontStyle: "italic" }}>({language.name})</span>}
                        </strong>
                        {expandedSub[`topic-${topicId}`] ? <FaChevronUp /> : <FaChevronDown />}
                      </div>

                      {expandedSub[`topic-${topicId}`] &&
                        sortedSteps.map((step) => (
                          <div key={step.id} className="avd-sub-card">
                            {editingId === step.id ? (
                              <>
                                {renderFormFields([
                                  "step_number",
                                  "step_file_name",
                                  "step_description",
                                  "step_source_code",
                                ])}
                                <div className="avd-card-buttons">
                                  <button
                                    className="avd-save-btn"
                                    onClick={() =>
                                      handleUpdate("backendsteps", step.id, setBackend)
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
                                <p style={{ fontWeight: "bold" }}>
                                  Step {step.step_number}: {step.step_file_name}
                                </p>
                                <pre className="avd-code-block">{step.step_description}</pre>
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
                                      handleDelete("backendsteps", step.id, setBackend)
                                    }
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
                })}
          </div>
        );
      });
  };



// =========== Template Types RENDER with -> { template } ===============
  const renderTemplateTypesTab = () =>
    templateTypes
      .slice()
      .sort((a, b) => b.id - a.id)
      .map((tt) => {
        const ttTemplates = templates
          .filter((t) => t.template_type.id === tt.id)
          .slice()
          .sort((a, b) => b.id - a.id);

        return (
          <div key={tt.id} className="avd-card">
            <div className="avd-card-header" onClick={() => toggleSub(tt.id)}>
              <strong>{tt.name}</strong>
              {expandedSub[tt.id] ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expandedSub[tt.id] &&
              (ttTemplates.length ? (
                ttTemplates.map((tpl) => (
                  <div key={tpl.id} className="avd-sub-card">
                    {editingId === tpl.id ? (
                      <>
                        {renderFormFields([
                          "title",
                          "project_info",
                          "iframe_url",
                          "download_repo_url",
                          "documentation",
                          "access_type",
                          "price",
                          "template_type_id",
                        ])}
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
                        <p>{tpl.title}</p>
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
                            onClick={() =>
                              handleDelete("templates", tpl.id, setTemplates)
                            }
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                "No Templates"
              ))}
          </div>
        );
      });



  // ===== Main Render =====
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
            {activeTab === "category" && renderCategoryTab()}
            {activeTab === "section" && renderSectionTab()}
            {activeTab === "language" && renderLanguageTab()}
            {activeTab === "topic" && renderTopicTab()}
            {activeTab === "backend" && renderCodeGuideTab()}
            {activeTab === "template" && renderTemplateTypesTab()}
          </div>
        </>
      )}
    </div>
  );

};

export default Admin_View_Data;
