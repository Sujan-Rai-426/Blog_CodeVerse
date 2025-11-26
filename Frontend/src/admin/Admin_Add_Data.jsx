import React, { useEffect, useState } from "react";
import "../assets/css/Admin_Add_Data.css";
import Admin_API from "./Admin_API"; // Axios instance with JWT

const Admin_Add_Data = () => {
  // =================== GLOBAL STATE ===================
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [templateTypes, setTemplateTypes] = useState([]);
  const [activeTab, setActiveTab] = useState("category");
  const [isUploading, setIsUploading] = useState(false);

  // =================== FORMS STATE ===================
  const [categoryName, setCategoryName] = useState("");
  const [sectionType, setSectionType] = useState("Frontend");
  const [categoryId, setCategoryId] = useState("");
  const [languageName, setLanguageName] = useState("");
  const [icon, setIcon] = useState("");

  const [topicName, setTopicName] = useState("");
  const [topicLanguage, setTopicLanguage] = useState("");

  const [frontendLanguage, setFrontendLanguage] = useState("");
  const [frontendTopic, setFrontendTopic] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [frontendTitle, setFrontendTitle] = useState("");
  const [frontendDesc, setFrontendDesc] = useState("");
  const [sourceAccessType, setSourceAccessType] = useState("");
  const [sourcePrice, setSourcePrice] = useState(0);

  const [backendLanguage, setBackendLanguage] = useState("");
  const [backendTopic, setBackendTopic] = useState("");
  const [stepNumber, setStepNumber] = useState(1);
  const [stepFileName, setStepFileName] = useState("");
  const [stepDescription, setStepDescription] = useState("");
  const [stepCode, setStepCode] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [occupiedSteps, setOccupiedSteps] = useState([]);

  const [templateTitle, setTemplateTitle] = useState("");
  const [templateInfo, setTemplateInfo] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");
  const [downloadRepoUrl, setDownloadRepoUrl] = useState("");
  const [documentationUrl, setDocumentationUrl] = useState("");
  const [accessType, setAccessType] = useState("");
  const [price, setPrice] = useState(0);
  const [templateType, setTemplateType] = useState("");

  // =================== FETCH DATA ===================
  const fetchCategories = async () => {
    try {
      const res = await Admin_API.get("/api/categories/");
      const data = res.data || [];
      setCategories(data);
      setSections(data.flatMap(c => c.sections || []));
      setLanguages(data.flatMap(c => c.sections?.flatMap(s => s.languages) || []));
    } catch (err) {
      console.error("Category fetch error:", err);
    }
  };

  const fetchTemplateTypes = async () => {
    try {
      const res = await Admin_API.get("/api/template-types/");
      setTemplateTypes(res.data || []);
    } catch (err) {
      console.error("Template type fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTemplateTypes();
  }, []);

  // =================== FILTER DATA ===================
  const frontendLanguages = sections.find(s => s.name?.toLowerCase() === "frontend")?.languages || [];
  const backendLanguages = sections.find(s => s.name?.toLowerCase() === "backend")?.languages || [];
  const frontendTopics = frontendLanguages.find(l => l.id === parseInt(frontendLanguage))?.topics || [];
  const backendTopics = backendLanguages.find(l => l.id === parseInt(backendLanguage))?.topics || [];

  useEffect(() => {
    const fetchOccupiedSteps = async () => {
      if (!backendTopic) return setOccupiedSteps([]);
      try {
        const res = await Admin_API.get(`/api/backendsteps/occupied-steps/${backendTopic}/`);
        setOccupiedSteps(res.data.occupied_steps || []);
      } catch (err) {
        console.error("Error fetching occupied steps:", err);
      }
    };
    fetchOccupiedSteps();
  }, [backendTopic]);

  // =================== COMMON STYLES ===================
  const formInputStyle = { background: "#121212", color: "#fff", border: "1px solid #555" };

  // =================== HANDLERS ===================
  const handleAddCategory = async e => {
    e.preventDefault();
    if (!categoryName.trim()) return alert("Category name required!");
    try {
      setIsUploading(true);
      await Admin_API.post("/api/categories/", { name: categoryName });
      setCategoryName("");
      await fetchCategories();
      alert("Category added!");
    } catch (err) {
      console.error(err);
      alert("Error adding category!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddLanguage = async e => {
    e.preventDefault();
    try {
      setIsUploading(true);
      const sec = sections.find(s => s.name === sectionType) || {};
      await Admin_API.post("/api/languages/", {
        section: sec.id,
        name: languageName,
        icon_class: icon,
        category: parseInt(categoryId),
      });
      setLanguageName(""); setIcon(""); setCategoryId("");
      await fetchCategories();
      alert("Language added!");
    } catch (err) {
      console.error(err);
      alert("Error adding language!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddTopic = async e => {
    e.preventDefault();
    if (!topicLanguage) return alert("Select language!");
    try {
      setIsUploading(true);
      await Admin_API.post("/api/topics/", { language: parseInt(topicLanguage), name: topicName });
      setTopicName(""); setTopicLanguage("");
      await fetchCategories();
      alert("Topic added!");
    } catch (err) {
      console.error(err);
      alert("Error adding topic!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddFrontend = async e => {
    e.preventDefault();
    if (!frontendLanguage || !frontendTopic) return alert("Select language + topic");
    if (!sourceAccessType) return alert("Select access type");
    try {
      setIsUploading(true);
      await Admin_API.post("/api/frontendsourcecodes/", {
        topic: parseInt(frontendTopic),
        title: frontendTitle || (frontendDesc ? frontendDesc.slice(0, 100) : "Untitled"),
        description: frontendDesc || "",
        html_code: htmlCode || "",
        css_code: cssCode || "",
        js_code: jsCode || "",
        access_type: sourceAccessType,
        price: parseFloat(sourcePrice) || 0,
      });
      setFrontendLanguage(""); setFrontendTopic(""); setHtmlCode(""); setCssCode(""); setJsCode("");
      setFrontendTitle(""); setFrontendDesc(""); setSourceAccessType(""); setSourcePrice(0);
      alert("Frontend Source Code added!");
    } catch (err) {
      console.error("Frontend add error:", err);
      alert("Error adding frontend content!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddBackend = async e => {
    e.preventDefault();
    if (!backendLanguage || !backendTopic) return alert("Select both language and topic!");
    try {
      setIsUploading(true);
      await Admin_API.post("/api/backendsteps/", {
        topic: parseInt(backendTopic),
        step_number: parseInt(stepNumber),
        step_file_name: stepFileName,
        step_description: stepDescription,
        step_source_code: stepCode,
      });
      if (imageFile) {
        const formData = new FormData();
        formData.append("topic", backendTopic);
        formData.append("image", imageFile);
        await Admin_API.post("/api/backendimages/", formData, { headers: { "Content-Type": "multipart/form-data" } });
      }
      setStepNumber(1); setStepFileName(""); setStepDescription(""); setStepCode(""); setImageFile(null);
      setBackendLanguage(""); setBackendTopic("");
      await fetchCategories();
      alert("Backend step added!");
    } catch (err) {
      console.error("Backend add error:", err);
      alert("Error adding backend step!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddTemplate = async e => {
    e.preventDefault();
    if (!templateType) return alert("Select template type");
    try {
      setIsUploading(true);
      await Admin_API.post("/api/templates/", {
        title: templateTitle,
        project_info: templateInfo,
        iframe_url: iframeUrl,
        download_repo_url: downloadRepoUrl,
        documentation: documentationUrl,
        access_type: accessType,
        price: parseFloat(price) || 0,
        template_type: templateType,
      });
      setTemplateTitle(""); setTemplateInfo(""); setIframeUrl(""); setDownloadRepoUrl(""); setDocumentationUrl("");
      setAccessType(""); setPrice(0); setTemplateType("");
      alert("Template added!");
    } catch (err) {
      console.error("Template add error:", err);
      alert("Error adding template!");
    } finally {
      setIsUploading(false);
    }
  };

  // =================== JSX ===================
  return (
    <div className="admin-dashboard p-3">
      {/* Tabs */}
      <div className="btn-group mb-3">
        {["category","language","topic","frontend","backend","template"].map(tab => (
          <button key={tab} className={`btn btn-outline-primary ${activeTab===tab?"active":""}`} onClick={()=>setActiveTab(tab)}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Upload overlay */}
      {isUploading && <div className="upload-overlay"><div className="spinner"/><div className="upload-text">Uploading…</div></div>}

      {/* ================== FORMS ================== */}

      {activeTab === "category" && <form onSubmit={handleAddCategory}>
        <h4>Add Category</h4>
        <input value={categoryName} onChange={e=>setCategoryName(e.target.value)} className="form-control mb-2" style={formInputStyle} placeholder="Category Name" required/>
        <button className="btn btn-success" disabled={isUploading}>Add Category</button>
      </form>}

      {activeTab === "language" && <form onSubmit={handleAddLanguage}>
        <h4>Add Language</h4>
        <label>Section</label>
        <select value={sectionType} onChange={e=>setSectionType(e.target.value)} className="form-control mb-2" style={formInputStyle} required>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
        </select>
        <label>Category</label>
        <select value={categoryId} onChange={e=>setCategoryId(e.target.value)} className="form-control mb-2" style={formInputStyle} required>
          <option value="">Select Category</option>
          {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label>Language Name</label>
        <input value={languageName} onChange={e=>setLanguageName(e.target.value)} className="form-control mb-2" style={formInputStyle} required/>
        <label>Icon Class</label>
        <input value={icon} onChange={e=>setIcon(e.target.value)} className="form-control mb-2" style={formInputStyle}/>
        <button className="btn btn-success" disabled={isUploading}>Add Language</button>
      </form>}

      {activeTab === "topic" && <form onSubmit={handleAddTopic}>
        <h4>Add Topic</h4>
        <label>Language</label>
        <select value={topicLanguage} onChange={e=>setTopicLanguage(e.target.value)} className="form-control mb-2" style={formInputStyle} required>
          <option value="">Select Language</option>
          {languages.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <label>Topic Name</label>
        <input value={topicName} onChange={e=>setTopicName(e.target.value)} className="form-control mb-2" style={formInputStyle} required/>
        <button className="btn btn-success" disabled={isUploading}>Add Topic</button>
      </form>}

      {activeTab === "frontend" && <form onSubmit={handleAddFrontend}>
        <h4>Add Frontend Design</h4>
        <label>Language</label>
        <select value={frontendLanguage} onChange={e=>setFrontendLanguage(e.target.value)} className="form-control mb-2" style={formInputStyle} required>
          <option value="">Select Frontend Language</option>
          {frontendLanguages.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <label>Topic</label>
        <select value={frontendTopic} onChange={e=>setFrontendTopic(e.target.value)} className="form-control mb-2" style={formInputStyle} required>
          <option value="">Select Topic</option>
          {frontendTopics.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <label>Access Type</label>
        <select value={sourceAccessType} onChange={e=>setSourceAccessType(e.target.value)} className="form-control mb-2" style={formInputStyle} required>
          <option value="">Select Access Type</option>
          <option value="Free">Free</option>
          <option value="Premium">Premium</option>
        </select>
        <label>Price (if Premium)</label>
        <input type="number" min={0} value={sourcePrice} onChange={e=>setSourcePrice(e.target.value)} className="form-control mb-2" style={formInputStyle}/>
        <label>Title</label>
        <input placeholder="Optional title" value={frontendTitle} onChange={e=>setFrontendTitle(e.target.value)} className="form-control mb-2" style={formInputStyle}/>
        <label>Description</label>
        <textarea value={frontendDesc} onChange={e=>setFrontendDesc(e.target.value)} className="form-control mb-2" style={formInputStyle}/>
        <label>HTML</label>
        <textarea value={htmlCode} onChange={e=>setHtmlCode(e.target.value)} className="form-control mb-2" style={formInputStyle}/>
        <label>CSS</label>
        <textarea value={cssCode} onChange={e=>setCssCode(e.target.value)} className="form-control mb-2" style={formInputStyle}/>
        <label>JS</label>
        <textarea value={jsCode} onChange={e=>setJsCode(e.target.value)} className="form-control mb-2" style={formInputStyle}/>
        <button className="btn btn-success" disabled={isUploading}>{isUploading?"Uploading...":"Add Frontend Code"}</button>
      </form>}

      {activeTab === "backend" && <form onSubmit={handleAddBackend}>
        <h4>Add Backend Step</h4>
        <label>Language</label>
        <select value={backendLanguage} onChange={e=>setBackendLanguage(e.target.value)} className="form-control mb-2" style={formInputStyle} required>
          <option value="">Select Backend Language</option>
          {backendLanguages.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <label>Topic</label>
        <select value={backendTopic} onChange={e=>setBackendTopic(e.target.value)} className="form-control mb-2" style={formInputStyle} required>
          <option value="">Select Topic</option>
          {backendTopics.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <label>Step Number</label>
        <select value={stepNumber} onChange={e=>setStepNumber(e.target.value)} className="form-control mb-2" style={formInputStyle} required>
          <option value="">Select Step Number</option>
          {Array.from({length:50},(_,i)=>i+1).map(num=>(
            <option key={num} value={num} disabled={occupiedSteps.includes(num)}>
              {occupiedSteps.includes(num) ? `Step ${num} — (Occupied)` : `Step ${num}`}
            </option>
          ))}
        </select>
        <label>Step File Name</label>
        <input value={stepFileName} onChange={e=>setStepFileName(e.target.value)} className="form-control mb-2" style={formInputStyle} required/>
        <label>Step Description</label>
        <textarea value={stepDescription} onChange={e=>setStepDescription(e.target.value)} className="form-control mb-2" style={formInputStyle}/>
        <label>Source Code</label>
        <textarea value={stepCode} onChange={e=>setStepCode(e.target.value)} className="form-control mb-2" style={formInputStyle}/>
        <label>Step Image (optional)</label>
        <input type="file" onChange={e=>setImageFile(e.target.files[0])} className="form-control mb-2" style={formInputStyle}/>
        <button className="btn btn-success" disabled={isUploading}>{isUploading?"Uploading...":"Add Backend Step"}</button>
      </form>}

            {activeTab === "template" && <form onSubmit={handleAddTemplate}>
        <h4>Add Template</h4>
        <label>Template Type</label>
        <select value={templateType} onChange={e => setTemplateType(e.target.value)} className="form-control mb-2" style={formInputStyle} required>
          <option value="">Select Template Type</option>
          {templateTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>

        <label>Title</label>
        <input value={templateTitle} onChange={e => setTemplateTitle(e.target.value)} className="form-control mb-2" style={formInputStyle} placeholder="Template Title" required />

        <label>Project Info</label>
        <textarea value={templateInfo} onChange={e => setTemplateInfo(e.target.value)} className="form-control mb-2" style={formInputStyle} placeholder="Brief info about the project" />

        <label>Iframe URL</label>
        <input value={iframeUrl} onChange={e => setIframeUrl(e.target.value)} className="form-control mb-2" style={formInputStyle} placeholder="Iframe preview URL" />

        <label>Download Repository URL</label>
        <input value={downloadRepoUrl} onChange={e => setDownloadRepoUrl(e.target.value)} className="form-control mb-2" style={formInputStyle} placeholder="GitHub or Repo URL" />

        <label>Documentation URL</label>
        <input value={documentationUrl} onChange={e => setDocumentationUrl(e.target.value)} className="form-control mb-2" style={formInputStyle} placeholder="Documentation URL" />

        <label>Access Type</label>
        <select value={accessType} onChange={e => setAccessType(e.target.value)} className="form-control mb-2" style={formInputStyle} required>
          <option value="">Select Access Type</option>
          <option value="Free">Free</option>
          <option value="Premium">Premium</option>
        </select>

        <label>Price (if Premium)</label>
        <input type="number" min={0} value={price} onChange={e => setPrice(e.target.value)} className="form-control mb-2" style={formInputStyle} />

        <button className="btn btn-success" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Add Template"}
        </button>
      </form>}

    </div>
  );
};

export default Admin_Add_Data;

