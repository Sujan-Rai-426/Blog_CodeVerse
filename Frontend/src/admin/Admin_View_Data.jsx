import React, { useEffect, useState } from "react";
import Admin_API from "./Admin_API";
import "../assets/css/Admin_View_Data.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const Admin_View_Data = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [topics, setTopics] = useState([]);
  const [frontend, setFrontend] = useState([]);
  const [backend, setBackend] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [templateTypes, setTemplateTypes] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  // ------------------ fetch all admin data ------------------
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
        templateTypesRes
      ] = await Promise.all([
        Admin_API.get("/api/categories/"),
        Admin_API.get("/api/sections/"),
        Admin_API.get("/api/languages/"),
        Admin_API.get("/api/topics/"),
        Admin_API.get("/api/frontendsourcecodes/"),
        Admin_API.get("/api/backendsteps/"),
        Admin_API.get("/api/templates/"),
        Admin_API.get("/api/template-types/")
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
      console.error("fetchData error:", err);
      alert("Error fetching admin data — check console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ------------------ helpers for names ------------------
  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || "Unknown";
  const getSectionName = (id) => sections.find(s => s.id === id)?.name || "Unknown";
  const getLanguageName = (id) => languages.find(l => l.id === id)?.name || "Unknown";
  const getTopicName = (id) => topics.find(t => t.id === id)?.name || "Unknown";
  const getTemplateTypeName = (id) => templateTypes.find(tt => tt.id === id)?.name || "Unknown";

  // group backend steps by topic id
  const groupedBackend = backend.reduce((acc, st) => {
    const key = String(st.topic);
    if (!acc[key]) acc[key] = [];
    acc[key].push(st);
    return acc;
  }, {});

  // ------------------ delete ------------------
  const handleDelete = async (endpoint, id, setStateFn) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await Admin_API.delete(`/api/${endpoint}/${id}/`);
      setStateFn(prev => prev.filter(i => i.id !== id));
      if (editingId === id) { setEditingId(null); setFormData({}); }
      alert("Deleted successfully");
    } catch (err) {
      console.error("delete error:", err);
      alert("Delete failed — check console.");
    }
  };

  // ------------------ edit / cancel ------------------
  const handleEdit = (item) => {
    setEditingId(item.id);
    // normalize formData: copy all top-level fields we expect
    setFormData({
      ...item
    });
    // scroll into view maybe
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleCancel = () => { setEditingId(null); setFormData({}); };

  // prepare payload for PATCH: convert FK selects to ints and booleans properly
  const preparePayload = (endpoint, data) => {
    const payload = { ...data };

    // convert known FK fields to integers if string
    const fkFields = {
      "sections": ["category"],
      "languages": ["section"],
      "topics": ["language"],
      "frontendsourcecodes": ["topic"],
      "backendsteps": ["topic"],
      "templates": ["template_type"]
    };

    if (fkFields[endpoint]) {
      fkFields[endpoint].forEach(f => {
        if (payload[f] === "" || payload[f] === null || typeof payload[f] === "undefined") {
          payload[f] = null;
        } else if (typeof payload[f] === "string" && /^[0-9]+$/.test(payload[f])) {
          payload[f] = parseInt(payload[f], 10);
        }
      });
    }

    // boolean fields
    if (endpoint === "frontendsourcecodes" && "hasBought" in payload) {
      payload.hasBought = !!payload.hasBought;
    }

    // price fields — ensure numbers
    if ("price" in payload && payload.price !== "") {
      payload.price = payload.price === null ? null : Number(payload.price);
    }

    return payload;
  };

  // ------------------ update (PATCH) ------------------
  const handleUpdate = async (endpoint, id, setStateFn) => {
    try {
      const payload = preparePayload(endpoint, formData);
      const res = await Admin_API.patch(`/api/${endpoint}/${id}/`, payload);
      // update local state array
      setStateFn(prev => prev.map(item => item.id === id ? res.data : item));
      setEditingId(null);
      setFormData({});
      alert("Updated successfully");
    } catch (err) {
      console.error("update error:", err);
      // If backend returned validation errors, show them if available
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : "Update failed — check console";
      alert(msg);
    }
  };

  // ------------------ tabs ------------------
  const tabs = [
    { key: "categories", label: "Categories" },
    { key: "sections", label: "Sections" },
    { key: "languages", label: "Languages" },
    { key: "topics", label: "Topics" },
    { key: "frontend", label: "Components" },
    { key: "backend", label: "Code Guide" },
    { key: "templates", label: "Templates" },
  ];

  if (loading) return <p className="avd-loading">Loading admin data...</p>;

  // ------------------ render each tab ------------------
  const renderTabData = () => {
    const card = "avd-card";

    switch(activeTab) {


      // ---------- Categories ----------
      case "categories":
        return categories.map(cat => (
          <div key={cat.id} className={card}>
            {editingId === cat.id ? (
              <>
                <label> Name </label>
                <input className="avd-input" value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Category name"/>
                <label> Description </label>
                <textarea className="avd-input" value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Category description"/>
                <div className="avd-card-buttons">
                  <button className="avd-save-btn" onClick={() => handleUpdate("categories", cat.id, setCategories)}>Save</button>
                  <button className="avd-cancel-btn" onClick={handleCancel}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p><strong>{cat.name}</strong></p>
                <p>{cat.description}</p>
                <div className="avd-card-buttons">
                  <button className="avd-edit-btn" onClick={() => handleEdit(cat)}> <FaEdit/> Edit</button>
                  {/* <button className="avd-delete-btn" onClick={() => handleDelete("categories", cat.id, setCategories)}> <FaTrash/> Delete</button> */}
                </div>
              </>
            )}
          </div>
        ));




      // ---------- Sections ----------
      case "sections":
        return sections.map(sec => (
          <div key={sec.id} className={card}>
            {editingId === sec.id ? (
              <>
                <label> Name (Frontend/Backend) </label>
                <select className="avd-select" value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})}>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                </select>

                <label> Category </label>
                <select className="avd-select" value={formData.category || ""} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="">-- Select Category --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                <div className="avd-card-buttons">
                  <button className="avd-save-btn" onClick={() => handleUpdate("sections", sec.id, setSections)}>Save</button>
                  <button className="avd-cancel-btn" onClick={handleCancel}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p><strong>{sec.name}</strong> <em>({getCategoryName(sec.category)})</em></p>
                <div className="avd-card-buttons">
                  <button className="avd-edit-btn" onClick={() => handleEdit(sec)}> <FaEdit/> Edit</button>
                  {/* <button className="avd-delete-btn" onClick={() => handleDelete("sections", sec.id, setSections)}> <FaTrash/> Delete</button> */}
                </div>
              </>
            )}
          </div>
        ));



      // ---------- Languages ----------
      case "languages":
        return languages.map(lang => (
          <div key={lang.id} className={card}>
            {editingId === lang.id ? (
              <>
                <label> Name </label>
                <input className="avd-input" value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Language name" />
                <label> Icon class (optional)</label>
                <input className="avd-input" value={formData.icon_class || ""} onChange={e => setFormData({...formData, icon_class: e.target.value})} placeholder="fa fa-js" />
                <label> Section </label>
                <select className="avd-select" value={formData.section || ""} onChange={e => setFormData({...formData, section: e.target.value})}>
                  <option value="">-- Select Section --</option>
                  {sections.map(s => <option key={s.id} value={s.id}>{s.name} [{getCategoryName(s.category)}]</option>)}
                </select>

                <div className="avd-card-buttons">
                  <button className="avd-save-btn" onClick={() => handleUpdate("languages", lang.id, setLanguages)}>Save</button>
                  <button className="avd-cancel-btn" onClick={handleCancel}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p><strong>{lang.name}</strong> <em>[{getSectionName(lang.section)}]</em></p>
                <div className="avd-card-buttons">
                  <button className="avd-edit-btn" onClick={() => handleEdit(lang)}> <FaEdit/> Edit</button>
                  {/* <button className="avd-delete-btn" onClick={() => handleDelete("languages", lang.id, setLanguages)}> <FaTrash/> Delete</button> */}
                </div>
              </>
            )}
          </div>
        ));




      // ---------- Topics ----------
      case "topics":
        return topics.map(topic => (
          <div key={topic.id} className={card}>
            {editingId === topic.id ? (
              <>
                <label> Name </label>
                <input className="avd-input" value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} placeholder={`Topic name [${getLanguageName(topic.language)}]`} />
                <label> Language </label>
                <select className="avd-select" value={formData.language || ""} onChange={e => setFormData({...formData, language: e.target.value})}>
                  <option value="">-- Select Language --</option>
                  {languages.map(l => <option key={l.id} value={l.id}>{l.name} [{getSectionName(l.section)}]</option>)}
                </select>
                <div className="avd-card-buttons">
                  <button className="avd-save-btn" onClick={() => handleUpdate("topics", topic.id, setTopics)}>Save</button>
                  <button className="avd-cancel-btn" onClick={handleCancel}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p><strong>{topic.name}</strong> <em>[{getLanguageName(topic.language)}]</em></p>
                <div className="avd-card-buttons">
                  <button className="avd-edit-btn" onClick={() => handleEdit(topic)}> <FaEdit/> Edit</button>
                  <button className="avd-delete-btn" onClick={() => handleDelete("topics", topic.id, setTopics)}> <FaTrash/> Delete</button>
                </div>
              </>
            )}
          </div>
        ));



      // ----------Components / Frontend Source Codes ----------
      case "frontend":
        return frontend.map(f => (
          <div key={f.id} className={card}>
            {editingId === f.id ? (
              <>
                <label> Title </label>
                <input className="avd-input" value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} placeholder={`Title [${getTopicName(f.topic)}]`} />

                <label> Description </label>
                <textarea className="avd-input" value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />

                <label> HTML Code </label>
                <textarea rows={6} className="avd-input" value={formData.html_code || ""} onChange={e => setFormData({...formData, html_code: e.target.value})} />

                <label> CSS Code </label>
                <textarea rows={6} className="avd-input" value={formData.css_code || ""} onChange={e => setFormData({...formData, css_code: e.target.value})} />

                <label> JS Code </label>
                <textarea rows={6} className="avd-input" value={formData.js_code || ""} onChange={e => setFormData({...formData, js_code: e.target.value})} />

                <label> Access Type </label>
                <select className="avd-select" value={formData.access_type || "Free"} onChange={e => setFormData({...formData, access_type: e.target.value})}>
                  <option value="Free">Free</option>
                  <option value="Premium">Premium</option>
                </select>

                <label> Price </label>
                <input className="avd-input" type="number" value={formData.price ?? 0} onChange={e => setFormData({...formData, price: e.target.value})} />

                <label> Has Bought </label>
                <input type="checkbox" checked={!!formData.hasBought} onChange={e => setFormData({...formData, hasBought: e.target.checked})} />

                <label> Topic </label>
                <select className="avd-select" value={formData.topic || ""} onChange={e => setFormData({...formData, topic: e.target.value})}>
                  <option value="">-- Select Topic --</option>
                  {topics.map(t => <option key={t.id} value={t.id}>{t.name} [{getLanguageName(t.language)}]</option>)}
                </select>

                <div className="avd-card-buttons">
                  <button className="avd-save-btn" onClick={() => handleUpdate("frontendsourcecodes", f.id, setFrontend)}>Save</button> 
                  <button className="avd-cancel-btn" onClick={handleCancel}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p><strong>{f.title}</strong> <em>[{getTopicName(f.topic)}]</em></p>
                <div className="avd-card-buttons">
                  <button className="avd-edit-btn" onClick={() => handleEdit(f)}> <FaEdit/> Edit</button>
                  <button className="avd-delete-btn" onClick={() => handleDelete("frontendsourcecodes", f.id, setFrontend)}> <FaTrash/> Delete</button>
                </div>
              </>
            )}
          </div>
        ));



      // ---------- Code Guide /  Backend Steps (grouped by topic) ----------
      case "backend":
        return Object.entries(groupedBackend).map(([topicId, steps]) => (
          <div key={topicId} className={card}>
            <h4>{getTopicName(parseInt(topicId, 10))}</h4>
            {steps.sort((a,b)=>a.step_number-b.step_number).map(step => (
              <div key={step.id} className="avd-sub-card">
                {editingId === step.id ? (
                  <>
                    <label> Step Number </label>
                    <input className="avd-input" type="number" value={formData.step_number || ""} onChange={e => setFormData({...formData, step_number: e.target.value})} />

                    <label> Step File Name </label>
                    <input className="avd-input" value={formData.step_file_name || ""} onChange={e => setFormData({...formData, step_file_name: e.target.value})} />

                    <label> Step Description </label>
                    <textarea className="avd-input" value={formData.step_description || ""} onChange={e => setFormData({...formData, step_description: e.target.value})} />

                    <label> Step Source Code </label>
                    <textarea rows={6} className="avd-input" value={formData.step_source_code || ""} onChange={e => setFormData({...formData, step_source_code: e.target.value})} />

                    <label> Topic </label>
                    <select className="avd-select" value={formData.topic || ""} onChange={e => setFormData({...formData, topic: e.target.value})}>
                      <option value="">-- Select Topic --</option>
                      {topics.map(t => <option key={t.id} value={t.id}>{t.name} [{getLanguageName(t.language)}]</option>)}
                    </select>

                    <div className="avd-card-buttons">
                      <button className="avd-save-btn" onClick={() => handleUpdate("backendsteps", step.id, setBackend)}>Save</button> 
                      <button className="avd-cancel-btn" onClick={handleCancel}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p><strong>Step {step.step_number}</strong> — {step.step_file_name}</p>
                    <small>{step.step_description}</small>
                    <div className="avd-card-buttons">
                      <button className="avd-edit-btn" onClick={() => handleEdit(step)}> <FaEdit/> Edit</button>
                      <button className="avd-delete-btn" onClick={() => handleDelete("backendsteps", step.id, setBackend)}> <FaTrash/> Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ));



      // ---------- Templates ----------
      case "templates":
        return templates.map(t => (
          <div key={t.id} className={card}>
            {editingId === t.id ? (
              <>
                <label> Title </label>
                <input className="avd-input" value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} />
                <label> Project Info </label>
                <textarea className="avd-input" value={formData.project_info || ""} onChange={e => setFormData({...formData, project_info: e.target.value})} />
                <label> iframe URL </label>
                <input className="avd-input" value={formData.iframe_url || ""} onChange={e => setFormData({...formData, iframe_url: e.target.value})} />
                <label> Download repo URL (optional)</label>
                <input className="avd-input" value={formData.download_repo_url || ""} onChange={e => setFormData({...formData, download_repo_url: e.target.value})} />
                <label> Documentation URL (optional)</label>
                <input className="avd-input" value={formData.documentation || ""} onChange={e => setFormData({...formData, documentation: e.target.value})} />

                <label> Template Type </label>
                <select className="avd-select" value={formData.template_type || (formData.template_type_id || "")} onChange={e => setFormData({...formData, template_type: e.target.value})}>
                  <option value="">-- Select Template Type --</option>
                  {templateTypes.map(tt => <option key={tt.id} value={tt.id}>{tt.name}</option>)}
                </select>

                <label> Access Type </label>
                <select className="avd-select" value={formData.access_type || "Free"} onChange={e => setFormData({...formData, access_type: e.target.value})}>
                  <option value="Free">Free</option>
                  <option value="Premium">Premium</option>
                </select>

                <label> Price </label>
                <input className="avd-input" type="number" value={formData.price ?? 0} onChange={e => setFormData({...formData, price: e.target.value})} />

                <div className="avd-card-buttons">
                  <button className="avd-save-btn" onClick={() => handleUpdate("templates", t.id, setTemplates)}>Save</button>
                  <button className="avd-cancel-btn" onClick={handleCancel}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p><strong>{t.title}</strong> <em>[{t.template_type?.name || "—"}]</em></p>
                <div className="avd-card-buttons">
                  <button className="avd-edit-btn" onClick={() => handleEdit(t)}> <FaEdit/> Edit</button>
                  <button className="avd-delete-btn" onClick={() => handleDelete("templates", t.id, setTemplates)}> <FaTrash/> Delete</button>
                </div>
              </>
            )}
          </div>
        ));

      default:
        return null;
    }
  };

  return (
    <div className="avd-dashboard p-3">
      <div className="avd-btn-group mb-3">
        {tabs.map(tab => (
          <button key={tab.key} className={`avd-btn ${activeTab===tab.key ? "avd-active":""}`} onClick={()=>setActiveTab(tab.key)}>{tab.label}</button>
        ))}
      </div>

      <div className="avd-tab-content">{renderTabData()}</div>
    </div>
  );
};

export default Admin_View_Data;
