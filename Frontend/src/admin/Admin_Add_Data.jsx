// src/pages/Admin_Add_Data.jsx
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import "../assets/css/Admin_Add_Data.css";
import { useAdmin } from "./Admin_API_Context";

/*
  Admin_Add_Data.jsx
  - Single-page admin "Add" UI (Category / Language / Topic / Frontend / Backend / Template)
  - Uses AdminAPI from Admin provider for all requests (keeps your names & filtering logic)
  - Optimized: stable callbacks, guarded effects, clear sections, small UX improvements
  - IMPORTANT: I did NOT rename or change your filtering variables (topicLanguage, frontendDesignLanguage, etc.)
*/

const Admin_Add_Data = () => {
  // =================== GLOBAL STATE ===================
  const [activeTab, setActiveTab] = useState("category");
  const [isUploading, setIsUploading] = useState(false);

  // =================== FORM STATES ===================
  // ---- Category ----
  const [categoryName, setCategoryName] = useState("");

  // ---- Language ----
  const [sectionType, setSectionType] = useState("Frontend");
  const [categoryId, setCategoryId] = useState("");
  const [languageName, setLanguageName] = useState("");
  const [icon, setIcon] = useState("");

  // ---- Topic ----
  const [topicName, setTopicName] = useState("");
  const [topicLanguage, setTopicLanguage] = useState("");

  // ---- Frontend Source ----
  const [frontendDesignLanguage, setfrontendDesignLanguage] = useState("");
  const [frontendTopic, setFrontendTopic] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [frontendTitle, setFrontendTitle] = useState("");
  const [frontendDesc, setFrontendDesc] = useState("");
  const [sourceAccessType, setSourceAccessType] = useState("");
  const [sourcePrice, setSourcePrice] = useState(0);

  // ---- Backend Step ----
  const [codeGuideLanguage, setcodeGuideLanguage] = useState("");
  const [backendTopic, setBackendTopic] = useState("");
  const [stepNumber, setStepNumber] = useState(1);
  const [stepFileName, setStepFileName] = useState("");
  const [stepDescription, setStepDescription] = useState("");
  const [stepCode, setStepCode] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [occupiedSteps, setOccupiedSteps] = useState([]);

  // ---- Template ----
  const [templateTitle, setTemplateTitle] = useState("");
  const [templateInfo, setTemplateInfo] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");
  const [downloadRepoUrl, setDownloadRepoUrl] = useState("");
  const [documentationUrl, setDocumentationUrl] = useState("");
  const [accessType, setAccessType] = useState("");
  const [price, setPrice] = useState(0);
  const [templateType, setTemplateType] = useState("");

  // =================== GET AdminAPI INSTANCE ===================
  // AdminAPI should already handle attaching Authorization header and token refresh.
  const { AdminAPI, updateCache, fetchAllData, cache } = useAdmin();

  // =================== COMMON INPUT STYLE ===================
  const formInputStyle = {
    background: "#121212",
    color: "#fff",
    border: "1px solid #555",
    padding: "8px",
    borderRadius: "6px",
  };

  // ===================
  // Ensure fetchAllData runs only once per mount & only when needed
  // ===================
  const hasFetchedOnce = useRef(false);

  useEffect(() => {
    // Only fetch if cache is empty
    if (hasFetchedOnce.current || cache?.allData) return;

    hasFetchedOnce.current = true;

    fetchAllData().catch((err) =>
      console.error("Error loading admin data (one-time):", err)
    );
  }, []); // <-- EMPTY dependency array ensures it runs only once


  // =================== DERIVED DATA (keeps your filtering names) ===================
  // We keep the same names and filtering approach you already had.
  const categories = cache?.allData?.categories || [];
  const templateTypes = cache?.allData?.template_types || [];

  const sections = useMemo(() => categories.flatMap((c) => c.sections || []), [
    categories,
  ]);

  const languages = useMemo(
    () => sections.flatMap((sec) => sec.languages || []),
    [sections]
  );

  const frontendDesignLanguages = useMemo(
    () =>
      sections
        .filter((sec) => sec.name === "Frontend")
        .flatMap((sec) => sec.languages || []),
    [sections]
  );

  const codeGuideLanguages = useMemo(
    () =>
      sections
        .filter((sec) => sec.name === "Backend")
        .flatMap((sec) => sec.languages || []),
    [sections]
  );

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

  // =================== FETCH OCCUPIED STEPS (dependent on backendTopic) ===================
  // This effect intentionally depends only on backendTopic to avoid needless re-fetch.
  useEffect(() => {
    if (!backendTopic) {
      setOccupiedSteps([]);
      return;
    }

    let mounted = true;
    const fetchSteps = async () => {
      try {
        // AdminAPI.get will retry on 401 by design (provider handles refresh)
        const res = await AdminAPI.get(
          `/api/backendsteps/occupied-steps/${backendTopic}/`
        );
        if (mounted) setOccupiedSteps(res.data?.occupied_steps || []);
      } catch (err) {
        console.error("Error fetching occupied steps:", err);
        if (mounted) setOccupiedSteps([]);
      }
    };
    fetchSteps();

    return () => {
      mounted = false;
    };
  }, [backendTopic, AdminAPI]);

  // ================================================================
  // ===================== API HANDLERS (optimized) =================
  // ================================================================

  // Helper wrapper to set uploading state around async handlers.
  const withUploading = useCallback(async (fn) => {
    setIsUploading(true);
    try {
      return await fn();
    } finally {
      setIsUploading(false);
    }
  }, []);

  // -------------------- Add Category --------------------
  const handleAddCategory = useCallback(
    async (e) => {
      e.preventDefault();
      if (!categoryName.trim()) return alert("Category name required!");

      await withUploading(async () => {
        try {
          const res = await AdminAPI.post("/api/categories/", {
            name: categoryName,
          });
          // updateCache preserves your signature: updateCache(key, item, action)
          updateCache("categories", res.data, "add");
          setCategoryName("");
          alert("Category added!");
        } catch (err) {
          console.error("Add category error:", err);
          alert("Error adding category!");
        }
      });
    },
    [categoryName, AdminAPI, updateCache, withUploading]
  );

  // -------------------- Add Language --------------------
  const handleAddLanguage = useCallback(
    async (e) => {
      e.preventDefault();
      if (!languageName.trim()) return alert("Language name required!");

      await withUploading(async () => {
        try {
          const sec = sections.find((s) => s.name === sectionType);
          const payload = {
            section: sec?.id,
            name: languageName,
            icon_class: icon,
            category: parseInt(categoryId, 10) || null,
          };
          const res = await AdminAPI.post("/api/languages/", payload);
          updateCache("languages", res.data, "add");
          setLanguageName("");
          setIcon("");
          setCategoryId("");
          alert("Language added!");
        } catch (err) {
          console.error("Add language error:", err);
          alert("Error adding language!");
        }
      });
    },
    [sections, sectionType, languageName, icon, categoryId, AdminAPI, updateCache, withUploading]
  );

  // -------------------- Add Topic --------------------
  const handleAddTopic = useCallback(
    async (e) => {
      e.preventDefault();
      if (!topicLanguage) return alert("Select language!");

      await withUploading(async () => {
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
        }
      });
    },
    [topicLanguage, topicName, AdminAPI, updateCache, withUploading]
  );

  // -------------------- Add Frontend Source --------------------
  const handleAddFrontend = useCallback(
    async (e) => {
      e.preventDefault();
      if (!frontendDesignLanguage || !frontendTopic)
        return alert("Select language + topic");
      if (!sourceAccessType) return alert("Select access type");

      await withUploading(async () => {
        try {
          const payload = {
            topic: parseInt(frontendTopic, 10),
            title:
              frontendTitle ||
              (frontendDesc ? frontendDesc.slice(0, 100) : "Untitled"),
            description: frontendDesc || "",
            html_code: htmlCode || "",
            css_code: cssCode || "",
            js_code: jsCode || "",
            access_type: sourceAccessType,
            price: parseFloat(sourcePrice) || 0,
          };

          const res = await AdminAPI.post("/api/frontendsourcecodes/", payload);
          updateCache("frontend", res.data, "add");

          // Reset fields (preserve emptiness)
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
        }
      });
    },
    [
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
      withUploading,
    ]
  );

  // -------------------- Add Backend Step --------------------
  const handleAddBackend = useCallback(
    async (e) => {
      e.preventDefault();
      if (!codeGuideLanguage || !backendTopic)
        return alert("Select language + topic!");

      await withUploading(async () => {
        try {
          const stepPayload = {
            topic: parseInt(backendTopic, 10),
            step_number: parseInt(stepNumber, 10),
            step_file_name: stepFileName,
            step_description: stepDescription,
            step_source_code: stepCode,
          };

          const stepRes = await AdminAPI.post("/api/backendsteps/", stepPayload);
          updateCache("backend_steps", stepRes.data, "add");

          // If there's image, upload separately (form-data)
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
        }
      });
    },
    [
      backendTopic,
      stepNumber,
      stepFileName,
      stepDescription,
      stepCode,
      imageFile,
      codeGuideLanguage,
      AdminAPI,
      updateCache,
      withUploading,
    ]
  );

  // -------------------- Add Template --------------------
  const handleAddTemplate = useCallback(
    async (e) => {
      e.preventDefault();
      if (!templateType) return alert("Select template type");

      await withUploading(async () => {
        try {
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

          const res = await AdminAPI.post("/api/templates/", payload);
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
        }
      });
    },
    [
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
      withUploading,
    ]
  );

  // =================== RENDER JSX ===================
  return (
    <div className="admin-dashboard p-3">
      {/* ============ TAB CONTROLS ============ */}
      <div className="btn-group mb-3" role="group" aria-label="Admin Tabs">
        {[
          "category",
          "language",
          "topic",
          "designs",
          "code-guides",
          "template",
        ].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`btn btn-outline-primary ${
              activeTab === tab ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ============ UPLOADING OVERLAY ============ */}
      {isUploading && (
        <div className="upload-overlay" role="status" aria-live="polite">
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
