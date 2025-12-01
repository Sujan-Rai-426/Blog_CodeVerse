// src/pages/Admin_Add_Data.jsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import "../assets/css/Admin_Add_Data.css";
import { useAdmin } from "./Admin_API_Provider";

const Admin_Add_Data = () => {
  // =================== GLOBAL STATE ===================
  const [activeTab, setActiveTab] = useState("category");
  const [isUploading, setIsUploading] = useState(false);

  // =================== FORM STATES ===================
  const [categoryName, setCategoryName] = useState("");
  const [sectionType, setSectionType] = useState("Frontend");
  const [categoryId, setCategoryId] = useState("");
  const [languageName, setLanguageName] = useState("");
  const [icon, setIcon] = useState("");

  const [topicName, setTopicName] = useState("");
  const [topicLanguage, setTopicLanguage] = useState("");

  const [frontendDesignLanguage, setfrontendDesignLanguage] = useState("");
  const [frontendTopic, setFrontendTopic] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [frontendTitle, setFrontendTitle] = useState("");
  const [frontendDesc, setFrontendDesc] = useState("");
  const [sourceAccessType, setSourceAccessType] = useState("");
  const [sourcePrice, setSourcePrice] = useState(0);

  const [codeGuideLanguage, setcodeGuideLanguage] = useState("");
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

  // =================== GET AdminAPI INSTANCE ===================
  const { AdminAPI, updateCache, fetchAllData, cache } = useAdmin();

  // =================== COMMON INPUT STYLE ===================
  const formInputStyle = {
    background: "#121212",
    color: "#fff",
    border: "1px solid #555",
    padding: "8px",
    borderRadius: "6px"
  };

  // ===================
  // Ensure fetchAllData runs only once per mount & only when needed
  // ===================
  const hasFetchedOnce = useRef(false);

  useEffect(() => {
    let isMounted = true;

    // If cache already has allData, we don't need to fetch
    if (hasFetchedOnce.current || cache.allData) return;

    const load = async () => {
      try {
        hasFetchedOnce.current = true; // mark so we won't call again
        const data = await fetchAllData(); // provider handles caching
        // nothing else to do — provider updated cache; local components read from cache
      } catch (err) {
        // Important: don't re-try automatically here — that can create loops/waste
        // Log error once and allow user actions to trigger retry (or manual retry button)
        console.error("Error loading admin data (one-time):", err);
        // Optionally: set a local `error` state and show a retry button in UI
      } finally {
        // nothing to set locally; provider handles loading state
      }
    };

    if (isMounted) load();

    return () => {
      isMounted = false;
    };
  }, [fetchAllData, cache.allData]); // safe: callback stable via provider.useCallback

  // =================== DERIVED DATA ===================
  const categories = cache.allData?.categories || [];
  const templateTypes = cache.allData?.template_types || [];

  const sections = useMemo(() => {
    return categories.flatMap((c) => c.sections || []);
  }, [categories]);

  const languages = useMemo(() => {
    return sections.flatMap((sec) => sec.languages || []);
  }, [sections]);

  const frontendDesignLanguages = useMemo(() => {
    return sections
      .filter((sec) => sec.name === "Frontend")
      .flatMap((sec) => sec.languages || []);
  }, [sections]);

  const codeGuideLanguages = useMemo(() => {
    return sections
      .filter((sec) => sec.name === "Backend")
      .flatMap((sec) => sec.languages || []);
  }, [sections]);

  const frontendDesigns = useMemo(() => {
    return (
      frontendDesignLanguages.find((l) => l.id === Number(frontendDesignLanguage))
        ?.topics || []
    );
  }, [frontendDesignLanguages, frontendDesignLanguage]);

  const codingGuides = useMemo(() => {
    return (
      codeGuideLanguages.find((l) => l.id === Number(codeGuideLanguage))
        ?.topics || []
    );
  }, [codeGuideLanguages, codeGuideLanguage]);

  // =================== FETCH OCCUPIED STEPS ===================
  // keep dependency only on backendTopic — AdminAPI removed intentionally
  useEffect(() => {
    if (!backendTopic) {
      setOccupiedSteps([]);
      return;
    }

    let isMounted = true;
    const fetchSteps = async () => {
      try {
        const res = await AdminAPI.get(
          `/api/backendsteps/occupied-steps/${backendTopic}/`
        );
        if (isMounted) setOccupiedSteps(res.data.occupied_steps || []);
      } catch (err) {
        console.error("Error fetching occupied steps:", err);
      }
    };
    fetchSteps();
    return () => {
      isMounted = false;
    };
  }, [backendTopic]); // intentionally NOT including AdminAPI to avoid retrigger when provider object identity changes

  // ================================================================
  // ================ API HANDLERS (optimized) ======================
  // ================================================================

  const handleAddCategory = useCallback(async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return alert("Category name required!");
    setIsUploading(true);
    try {
      const res = await AdminAPI.post("/api/categories/", { name: categoryName });
      updateCache("categories", res.data, "add");
      setCategoryName("");
      alert("Category added!");
    } catch (err) {
      console.error("Add category error:", err);
      alert("Error adding category!");
    } finally {
      setIsUploading(false);
    }
  }, [categoryName, AdminAPI, updateCache]);

  const handleAddLanguage = useCallback(async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const sec = sections.find((s) => s.name === sectionType);
      const res = await AdminAPI.post("/api/languages/", {
        section: sec?.id,
        name: languageName,
        icon_class: icon,
        category: parseInt(categoryId, 10),
      });
      updateCache("languages", res.data, "add");
      setLanguageName("");
      setIcon("");
      setCategoryId("");
      alert("Language added!");
    } catch (err) {
      console.error("Add language error:", err);
      alert("Error adding language!");
    } finally {
      setIsUploading(false);
    }
  }, [sections, sectionType, languageName, icon, categoryId, AdminAPI, updateCache]);

  const handleAddTopic = useCallback(async (e) => {
    e.preventDefault();
    if (!topicLanguage) return alert("Select language!");
    setIsUploading(true);
    try {
      const res = await AdminAPI.post("/api/topics/", {
        language: parseInt(topicLanguage, 10),
        name: topicName,
      });
      updateCache("topics", res.data, "add");
      setTopicName("");
      setTopicLanguage("");
      alert("Topic added!");
    } catch (err) {
      console.error("Add topic error:", err);
      alert("Error adding topic!");
    } finally {
      setIsUploading(false);
    }
  }, [topicLanguage, topicName, AdminAPI, updateCache]);

  const handleAddFrontend = useCallback(async (e) => {
    e.preventDefault();
    if (!frontendDesignLanguage || !frontendTopic) return alert("Select language + topic");
    if (!sourceAccessType) return alert("Select access type");
    setIsUploading(true);
    try {
      const payload = {
        topic: parseInt(frontendTopic, 10),
        title: frontendTitle || (frontendDesc ? frontendDesc.slice(0, 100) : "Untitled"),
        description: frontendDesc || "",
        html_code: htmlCode || "",
        css_code: cssCode || "",
        js_code: jsCode || "",
        access_type: sourceAccessType,
        price: parseFloat(sourcePrice) || 0,
      };
      const res = await AdminAPI.post("/api/frontendsourcecodes/", payload);
      updateCache("frontend", res.data, "add");
      // Reset
      setfrontendDesignLanguage("");
      setFrontendTopic("");
      setHtmlCode("");
      setCssCode("");
      setJsCode("");
      setFrontendTitle("");
      setFrontendDesc("");
      setSourceAccessType("");
      setSourcePrice(0);
      alert("Frontend Source added!");
    } catch (err) {
      console.error("Add frontend error:", err);
      alert("Error adding frontend code!");
    } finally {
      setIsUploading(false);
    }
  }, [
    frontendDesignLanguage,
    frontendTopic,
    frontendTitle,
    frontendDesc,
    htmlCode,
    cssCode,
    jsCode,
    sourceAccessType,
    sourcePrice,
    AdminAPI,
    updateCache,
  ]);

  const handleAddBackend = useCallback(async (e) => {
    e.preventDefault();
    if (!codeGuideLanguage || !backendTopic) return alert("Select language + topic!");
    setIsUploading(true);
    try {
      const stepRes = await AdminAPI.post("/api/backendsteps/", {
        topic: parseInt(backendTopic, 10),
        step_number: parseInt(stepNumber, 10),
        step_file_name: stepFileName,
        step_description: stepDescription,
        step_source_code: stepCode,
      });
      updateCache("backend_steps", stepRes.data, "add");
      if (imageFile) {
        const formData = new FormData();
        formData.append("topic", backendTopic);
        formData.append("image", imageFile);
        const imgRes = await AdminAPI.post("/api/backendimages/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        updateCache("backend_images", imgRes.data, "add");
      }
      // Reset
      setStepNumber(1);
      setStepFileName("");
      setStepDescription("");
      setStepCode("");
      setImageFile(null);
      setcodeGuideLanguage("");
      setBackendTopic("");
      alert("Backend step added!");
    } catch (err) {
      console.error("Add backend error:", err);
      alert("Error adding backend step!");
    } finally {
      setIsUploading(false);
    }
  }, [
    backendTopic,
    stepNumber,
    stepFileName,
    stepDescription,
    stepCode,
    imageFile,
    codeGuideLanguage,
    AdminAPI,
    updateCache,
  ]);

  const handleAddTemplate = useCallback(async (e) => {
    e.preventDefault();
    if (!templateType) return alert("Select template type");
    setIsUploading(true);
    try {
      const res = await AdminAPI.post("/api/templates/", {
        title: templateTitle,
        project_info: templateInfo,
        iframe_url: iframeUrl,
        download_repo_url: downloadRepoUrl,
        documentation: documentationUrl,
        access_type: accessType,
        price: parseFloat(price) || 0,
        template_type: templateType,
      });
      updateCache("templates", res.data, "add");
      // Reset
      setTemplateTitle("");
      setTemplateInfo("");
      setIframeUrl("");
      setDownloadRepoUrl("");
      setDocumentationUrl("");
      setAccessType("");
      setPrice(0);
      setTemplateType("");
      alert("Template added successfully!");
    } catch (err) {
      console.error("Add template error:", err);
      alert("Error adding template!");
    } finally {
      setIsUploading(false);
    }
  }, [
    templateType,
    templateTitle,
    templateInfo,
    iframeUrl,
    downloadRepoUrl,
    documentationUrl,
    accessType,
    price,
    AdminAPI,
    updateCache,
  ]);

  // =================== JSX ===================
  return (
    <div className="admin-dashboard p-3">
      <div className="btn-group mb-3">
        {["category", "language", "topic", "designs", "code-guides", "template"].map(
          (tab) => (
            <button
              key={tab}
              className={`btn btn-outline-primary ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          )
        )}
      </div>

      {isUploading && (
        <div className="upload-overlay">
          <div className="spinner" />
          <div className="upload-text">Uploading…</div>
        </div>
      )}

      {/* ================== FORMS ================== */}

      {/* ADD CATEGORY */}
      {activeTab === "category" && (
        <form onSubmit={handleAddCategory}>
          <h4>Add Category</h4>
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            placeholder="Category Name"
            required
          />
          <button className="btn btn-success" disabled={isUploading}>
            Add Category
          </button>
        </form>
      )}

      {/* ADD LANGUAGE */}
      {activeTab === "language" && (
        <form onSubmit={handleAddLanguage}>
          <h4>Add Language</h4>
          <label>Section</label>
          <select
            value={sectionType}
            onChange={(e) => setSectionType(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            required
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
          </select>

          <label>Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label>Language Name</label>
          <input
            value={languageName}
            onChange={(e) => setLanguageName(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            required
          />

          <label>Icon Class</label>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
          />
          <button className="btn btn-success" disabled={isUploading}>
            Add Language
          </button>
        </form>
      )}

      {/* ADD TOPIC */}
      {activeTab === "topic" && (
        <form onSubmit={handleAddTopic}>
          <h4>Add Topic</h4>
          <label>Language</label>
          <select
            value={topicLanguage}
            onChange={(e) => setTopicLanguage(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            required
          >
            <option value="">Select Language</option>
            {languages.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          <label>Topic Name</label>
          <input
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            required
          />
          <button className="btn btn-success" disabled={isUploading}>
            Add Topic
          </button>
        </form>
      )}

      {/* ADD FRONTEND DESIGNS */}
      {activeTab === "designs" && (
        <form onSubmit={handleAddFrontend}>
          <h4>Add Frontend Design</h4>
          <label>Language</label>
          <select
            value={frontendDesignLanguage}
            onChange={(e) => setfrontendDesignLanguage(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            required
          >
            <option value="">Select Frontend Language</option>
            {frontendDesignLanguages.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          <label>Topic</label>
          <select
            value={frontendTopic}
            onChange={(e) => setFrontendTopic(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            required
          >
            <option value="">Select Topic</option>
            {frontendDesigns.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <label>Access Type</label>
          <select
            value={sourceAccessType}
            onChange={(e) => setSourceAccessType(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            required
          >
            <option value="">Select Access Type</option>
            <option value="Free">Free</option>
            <option value="Premium">Premium</option>
          </select>

          <label>Price (if Premium)</label>
          <input
            type="number"
            min={0}
            value={sourcePrice}
            onChange={(e) => setSourcePrice(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
          />

          <label>Title</label>
          <input
            placeholder="Optional title"
            value={frontendTitle}
            onChange={(e) => setFrontendTitle(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
          />

          <label>Description</label>
          <textarea
            value={frontendDesc}
            onChange={(e) => setFrontendDesc(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
          />

          <label>HTML</label>
          <textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
          />

          <label>CSS</label>
          <textarea
            value={cssCode}
            onChange={(e) => setCssCode(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
          />

          <label>JS</label>
          <textarea
            value={jsCode}
            onChange={(e) => setJsCode(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
          />

          <button className="btn btn-success" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Add Frontend Code"}
          </button>
        </form>
      )}

      {/* ADD BACKEND CODING GUIDE */}
      {activeTab === "code-guides" && (
        <form onSubmit={handleAddBackend}>
          <h4>Add Backend Step</h4>

          <label>Language</label>
          <select
            value={codeGuideLanguage}
            onChange={(e) => setcodeGuideLanguage(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            required
          >
            <option value="">Select Backend Language</option>
            {codeGuideLanguages.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          <label>Topic</label>
          <select
            value={backendTopic}
            onChange={(e) => setBackendTopic(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            required
          >
            <option value="">Select Topic</option>
            {codingGuides.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <label>Step Number</label>
          <select
            value={stepNumber}
            onChange={(e) => setStepNumber(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            required
          >
            <option value="">Select Step Number</option>
            {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num} disabled={occupiedSteps.includes(num)}>
                {occupiedSteps.includes(num) ? `Step ${num} — (Occupied)` : `Step ${num}`}
              </option>
            ))}
          </select>

          <label>Step File Name</label>
          <input
            value={stepFileName}
            onChange={(e) => setStepFileName(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            required
          />

          <label>Step Description</label>
          <textarea
            value={stepDescription}
            onChange={(e) => setStepDescription(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
          />

          <label>Source Code</label>
          <textarea
            value={stepCode}
            onChange={(e) => setStepCode(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
          />

          <label>Step Image (optional)</label>
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="form-control mb-2"
            style={formInputStyle}
          />

          <button className="btn btn-success" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Add Backend Step"}
          </button>
        </form>
      )}

      {/* ADD TEMPLATE */}
      {activeTab === "template" && (
        <form onSubmit={handleAddTemplate}>
          <h4>Add Template</h4>

          <label>Template Type</label>
          <select
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            required
          >
            <option value="">Select Template Type</option>
            {templateTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <label>Title</label>
          <input
            value={templateTitle}
            onChange={(e) => setTemplateTitle(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            placeholder="Template Title"
            required
          />

          <label>Project Info</label>
          <textarea
            value={templateInfo}
            onChange={(e) => setTemplateInfo(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            placeholder="Brief info about the project"
          />

          <label>Iframe URL</label>
          <input
            value={iframeUrl}
            onChange={(e) => setIframeUrl(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            placeholder="Iframe preview URL"
          />

          <label>Download Repository URL</label>
          <input
            value={downloadRepoUrl}
            onChange={(e) => setDownloadRepoUrl(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            placeholder="GitHub or Repo URL"
          />

          <label>Documentation URL</label>
          <input
            value={documentationUrl}
            onChange={(e) => setDocumentationUrl(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            placeholder="Documentation URL"
          />

          <label>Access Type</label>
          <select
            value={accessType}
            onChange={(e) => setAccessType(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
            required
          >
            <option value="">Select Access Type</option>
            <option value="Free">Free</option>
            <option value="Premium">Premium</option>
          </select>

          <label>Price (if Premium)</label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control mb-2"
            style={formInputStyle}
          />

          <button className="btn btn-success" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Add Template"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Admin_Add_Data;
