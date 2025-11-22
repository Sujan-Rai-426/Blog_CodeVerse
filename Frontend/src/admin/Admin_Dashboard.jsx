import React, { useEffect, useState } from "react";
import "../assets/css/Admin_Dashboard.css";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Admin_Dashboard = () => {
  const navigate = useNavigate();

  // ---------- State ----------
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [templateTypes, setTemplateTypes] = useState([]);
  const [activeTab, setActiveTab] = useState("language");
  const [isUploading, setIsUploading] = useState(false);

  // ---------- Language Form ----------
  const [sectionType, setSectionType] = useState("Frontend");
  const [categoryId, setCategoryId] = useState("");
  const [languageName, setLanguageName] = useState("");
  const [icon, setIcon] = useState("");

  // ---------- Topic Form ----------
  const [topicName, setTopicName] = useState("");
  const [topicLanguage, setTopicLanguage] = useState("");

  // ---------- Frontend Form ----------
  const [frontendLanguage, setFrontendLanguage] = useState("");
  const [frontendTopic, setFrontendTopic] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [frontendDesc, setFrontendDesc] = useState("");
  const [videoAccessType, setVideoAccessType] = useState("");
  const [sourceCodeAccessType, setSourceCodeAccessType] = useState("");

  // ---------- Backend Form ----------
  const [backendLanguage, setBackendLanguage] = useState("");
  const [backendTopic, setBackendTopic] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [stepNumber, setStepNumber] = useState(1);
  const [stepFileName, setStepFileName] = useState("");
  const [stepDescription, setStepDescription] = useState("");
  const [stepCode, setStepCode] = useState("");
  const [occupiedSteps, setOccupiedSteps] = useState([]);

  // ---------- Template Form ----------
  const [templateTitle, setTemplateTitle] = useState("");
  const [templateInfo, setTemplateInfo] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");
  const [downloadRepoUrl, setDownloadRepoUrl] = useState("");
  const [documentationUrl, setDocumentationUrl] = useState("");
  const [accessType, setAccessType] = useState("");
  const [price, setPrice] = useState(0);
  const [templateType, setTemplateType] = useState("");

  // ---------- Fetch Categories ----------
  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories/");
      const data = res.data || [];
      setCategories(data);
      setSections(data.flatMap(c => c.sections || []));
      setLanguages(data.flatMap(c => c.sections?.flatMap(s => s.languages) || []));
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // ---------- Fetch Template Types ----------
  const fetchTemplateTypes = async () => {
    try {
      const res = await api.get("/api/template-types/");
      setTemplateTypes(res.data || []);
    } catch (err) {
      console.error("Error fetching template types:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTemplateTypes();
  }, []);

  // ---------- Derived dropdown lists ----------
  const frontendLanguages = sections.find(s => s.name?.toLowerCase() === "frontend")?.languages || [];
  const backendLanguages = sections.find(s => s.name?.toLowerCase() === "backend")?.languages || [];
  const frontendTopics = frontendLanguages.find(l => l.id === parseInt(frontendLanguage))?.topics || [];
  const backendTopics = backendLanguages.find(l => l.id === parseInt(backendLanguage))?.topics || [];
  const topicLangOptions = languages;

  // ---------- Logout ----------
  const handleLogout = () => {
    window.localStorage.removeItem("loggedIn");
    navigate("/Admin_Login");
  };

  // ---------- Add Language ----------
  const handleAddLanguage = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      const sec = sections.find(s => s.name === sectionType);
      if (!sec) return alert("Section not selected");
      if (!categoryId) return alert("Please select category");

      await api.post("/api/languages/", { section: sec.id, name: languageName, icon_class: icon, category: parseInt(categoryId) });

      setLanguageName(""); setIcon(""); setCategoryId("");
      fetchCategories();
      alert("Language added successfully!");
    } catch (err) {
      console.error(err.response ? err.response.data : err);
      alert("Error adding language!");
    } finally { setIsUploading(false); }
  };

  // ---------- Add Topic ----------
  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!topicLanguage) return alert("Please select a language");
    try {
      setIsUploading(true);
      await api.post("/api/topics/", { language: parseInt(topicLanguage), name: topicName });
      setTopicName(""); setTopicLanguage("");
      fetchCategories();
      alert("Topic added successfully!");
    } catch (err) {
      console.error(err.response ? err.response.data : err);
      alert(err.response?.data?.error || "Error adding topic!");
    } finally { setIsUploading(false); }
  };

  // ---------- Add Frontend ----------
  const handleAddFrontend = async (e) => {
    e.preventDefault();
    if (!frontendLanguage || !frontendTopic || !videoFile) return alert("Please select language, topic, and upload a video file");
    if (!videoAccessType || !sourceCodeAccessType) return alert("Please select access types for video and source code");

    try {
      setIsUploading(true);
      const videoFormData = new FormData();
      videoFormData.append("topic", parseInt(frontendTopic));
      videoFormData.append("title", String(frontendDesc || "Untitled Video"));
      videoFormData.append("video_url", videoFile);
      videoFormData.append("access_type", videoAccessType);

      const videoRes = await api.post("/api/frontendvideos/", videoFormData, { headers: { "Content-Type": "multipart/form-data" } });
      const videoId = videoRes.data.id;

      if (frontendDesc) {
        await api.post("/api/frontendvideoinfo/", { video: videoId, description: String(frontendDesc) });
      }

      if (htmlCode || cssCode || jsCode) {
        await api.post("/api/frontendsourcecodes/", {
          video: videoId,
          html_code: htmlCode || "",
          css_code: cssCode || "",
          js_code: jsCode || "",
          access_type: sourceCodeAccessType,
        });
      }

      setVideoFile(null); setHtmlCode(""); setCssCode(""); setJsCode(""); setFrontendDesc(""); setFrontendTopic(""); setFrontendLanguage(""); setVideoAccessType(""); setSourceCodeAccessType("");
      alert("✅ Frontend content added successfully!");
    } catch (err) {
      console.error("Error adding frontend content:", err.response ? err.response.data : err);
      alert("❌ Error adding frontend content!");
    } finally { setIsUploading(false); }
  };

  // ---------- Add Backend ----------
  const handleAddBackend = async (e) => {
    e.preventDefault();
    if (!backendLanguage || !backendTopic) return alert("Please select language and topic");

    try {
      setIsUploading(true);
      const stepPayload = { topic: parseInt(backendTopic), step_number: parseInt(stepNumber), step_file_name: stepFileName, step_description: stepDescription, step_source_code: stepCode };
      await api.post("/api/backendsteps/", stepPayload);

      if (imageFile) {
        const formData = new FormData();
        formData.append("topic", parseInt(backendTopic));
        formData.append("image", imageFile);
        await api.post("/api/backendimages/", formData, { headers: { "Content-Type": "multipart/form-data" } });
      }

      setStepNumber(1); setStepFileName(""); setStepDescription(""); setStepCode(""); setImageFile(null); setBackendLanguage(""); setBackendTopic("");
      alert("Backend step and image added successfully!");
    } catch (err) {
      console.error("Backend add error:", err.response ? err.response.data : err);
      alert("Error! Step number may already exist.");
    } finally { setIsUploading(false); }
  };

  // ---------- Add Template ----------
  const handleAddTemplate = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      const payload = {
        title: templateTitle,
        project_info: templateInfo,
        iframe_url: iframeUrl,
        download_repo_url: downloadRepoUrl,
        documentation: documentationUrl,
        access_type: accessType,
        price: parseFloat(price) || 0,
        template_type: templateType,
      };

      await api.post("/api/templates/", payload);

      setTemplateTitle(""); setTemplateInfo(""); setIframeUrl(""); setDownloadRepoUrl(""); setDocumentationUrl(""); setAccessType(""); setPrice(0); setTemplateType("");
      alert("✅ Template added successfully!");
    } catch (err) {
      console.error(err.response ? err.response.data : err);
      alert("❌ Error adding template!");
    } finally { setIsUploading(false); }
  };

  // ---------- Fetch occupied steps ----------
  useEffect(() => {
    const fetchOccupiedSteps = async () => {
      if (!backendTopic) return setOccupiedSteps([]);
      try {
        const res = await api.get(`/api/backendsteps/occupied-steps/${backendTopic}/`);
        setOccupiedSteps(res.data.occupied_steps || []);
      } catch (err) { console.error("Error fetching occupied steps:", err); }
    };
    fetchOccupiedSteps();
  }, [backendTopic]);

  return (
    <div className="admin-dashboard my-5">
      <h4 className="mb-4 text-center text-light">Admin Dashboard 💡</h4>

      {/* Tabs */}
      <div className="btn-group mb-4">
        {["language", "topic", "frontend", "backend", "template"].map(tab => (
          <button
            key={tab}
            className={`btn btn-outline-primary ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Forms */}
      {activeTab === "language" && (
        <form onSubmit={handleAddLanguage} className="mb-4">
          <h4>Add Language</h4>
          <select className="form-control mb-2" value={sectionType} onChange={(e) => setSectionType(e.target.value)}>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
          </select>
          <select className="form-control mb-2" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="text" placeholder="Language Name" value={languageName} onChange={(e) => setLanguageName(e.target.value)} className="form-control mb-2" required />
          <input type="text" placeholder="Icon Class" value={icon} onChange={(e) => setIcon(e.target.value)} className="form-control mb-2" required />
          <div style={{ display: "flex", justifyContent: "space-between", margin: "0 1vw" }}>
            <button type="submit" className="btn btn-success" disabled={isUploading}>
              {isUploading ? <>Uploading...</> : "Add Language"}
            </button>
            <button type="button" className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </form>
      )}

      {activeTab === "topic" && (
        <form onSubmit={handleAddTopic} className="mb-4">
          <h4>Add Topic</h4>
          <select className="form-control mb-2" value={topicLanguage} onChange={(e) => setTopicLanguage(e.target.value)} required>
            <option value="">Select Language</option>
            {topicLangOptions.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <input type="text" placeholder="Topic Name" value={topicName} onChange={(e) => setTopicName(e.target.value)} className="form-control mb-2" required />
          <div style={{ display: "flex", justifyContent: "space-between", margin: "0 1vw" }}>
            <button type="submit" className="btn btn-success" disabled={isUploading}>{isUploading ? "Uploading..." : "Add Topic"}</button>
            <button type="button" className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </form>
      )}

      {/* Frontend Form */}
      {activeTab === "frontend" && (
        <form onSubmit={handleAddFrontend} className="mb-4">
          <h4>Add Frontend Content</h4>
          <select className="form-control mb-2" value={frontendLanguage} onChange={(e) => setFrontendLanguage(e.target.value)} required>
            <option value="">Select Language</option>
            {frontendLanguages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <select className="form-control mb-2" value={frontendTopic} onChange={(e) => setFrontendTopic(e.target.value)} required>
            <option value="">Select Topic</option>
            {frontendTopics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} className="form-control mb-2" required />
          <div className="mb-2">
            <select className="form-control mb-2" value={videoAccessType} onChange={(e) => setVideoAccessType(e.target.value)} required>
              <option value="">Video Access Type</option>
              <option value="Free">Free</option>
              <option value="Premium">Premium</option>
            </select>
            <select className="form-control mb-2" value={sourceCodeAccessType} onChange={(e) => setSourceCodeAccessType(e.target.value)} required>
              <option value="">Source Code Access Type</option>
              <option value="Free">Free</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          <textarea placeholder="HTML Code" value={htmlCode} onChange={(e) => setHtmlCode(e.target.value)} className="form-control mb-2" />
          <textarea placeholder="CSS Code" value={cssCode} onChange={(e) => setCssCode(e.target.value)} className="form-control mb-2" />
          <textarea placeholder="JS Code" value={jsCode} onChange={(e) => setJsCode(e.target.value)} className="form-control mb-2" />
          <textarea placeholder="Description" value={frontendDesc} onChange={(e) => setFrontendDesc(e.target.value)} className="form-control mb-2" />
          <div style={{ display: "flex", justifyContent: "space-between", margin: "0 1vw" }}>
            <button type="submit" className="btn btn-success" disabled={isUploading}>{isUploading ? "Uploading..." : "Add Frontend Content"}</button>
            <button type="button" className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </form>
      )}

      {/* Backend Form */}
      {activeTab === "backend" && (
        <form onSubmit={handleAddBackend} className="mb-4">
          <h4>Add Backend Step</h4>
          <select className="form-control mb-2" value={backendLanguage} onChange={(e) => setBackendLanguage(e.target.value)} required>
            <option value="">Select Backend Language</option>
            {backendLanguages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <select className="form-control mb-2" value={backendTopic} onChange={(e) => setBackendTopic(e.target.value)} required>
            <option value="">Select Topic</option>
            {backendTopics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="form-control mb-2" />
          <div className="mb-3">
            <label>Step Number</label>
            <input type="number" value={stepNumber} onChange={(e) => setStepNumber(e.target.value)} className="form-control" placeholder="Enter Step Number" />
            {occupiedSteps.length > 0 && <small className="text-muted">Occupied Step Numbers: {occupiedSteps.join(", ")}</small>}
          </div>
          <input type="text" placeholder="Step File Name" value={stepFileName} onChange={(e) => setStepFileName(e.target.value)} className="form-control mb-2" />
          <textarea placeholder="Step Description" value={stepDescription} onChange={(e) => setStepDescription(e.target.value)} className="form-control mb-2" />
          <textarea placeholder="Step Code" value={stepCode} onChange={(e) => setStepCode(e.target.value)} className="form-control mb-2" />
          <div style={{ display: "flex", justifyContent: "space-between", margin: "0 1vw" }}>
            <button type="submit" className="btn btn-success" disabled={isUploading}>{isUploading ? "Uploading..." : "Add Backend Step"}</button>
            <button type="button" className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </form>
      )}

      {/* Template Form */}
      {activeTab === "template" && (
        <form onSubmit={handleAddTemplate} className="mb-4">
          <h4>Add Template</h4>
          <input type="text" placeholder="Title" value={templateTitle} onChange={(e) => setTemplateTitle(e.target.value)} className="form-control mb-2" required />
          <textarea placeholder="Project Info" value={templateInfo} onChange={(e) => setTemplateInfo(e.target.value)} className="form-control mb-2" required />
          <input type="url" placeholder="Iframe URL" value={iframeUrl} onChange={(e) => setIframeUrl(e.target.value)} className="form-control mb-2" required />
          <input type="url" placeholder="Download Repo URL" value={downloadRepoUrl} onChange={(e) => setDownloadRepoUrl(e.target.value)} className="form-control mb-2" />
          <input type="url" placeholder="Documentation URL" value={documentationUrl} onChange={(e) => setDocumentationUrl(e.target.value)} className="form-control mb-2" />
          <select className="form-control mb-2" value={accessType} onChange={(e) => setAccessType(e.target.value)} required>
            <option value="">Select Access Type</option>
            <option value="Free">Free</option>
            <option value="Premium">Premium</option>
          </select>
          <select className="form-control mb-2" value={templateType} onChange={(e) => setTemplateType(e.target.value)} required>
            <option value="">Select Template Type</option>
            {templateTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control mb-2" min={0} />
          <div style={{ display: "flex", justifyContent: "space-between", margin: "0 1vw" }}>
            <button type="submit" className="btn btn-success" disabled={isUploading}>{isUploading ? "Uploading..." : "Add Template"}</button>
            <button type="button" className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Admin_Dashboard;
