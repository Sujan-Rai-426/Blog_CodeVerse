import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import "../assets/css/Admin_Add_Data.css";
// NOTE: Make sure the path is correct for your useAdmin hook
import { useAdmin } from "./Admin_API_Context"; 

/*
  Admin_Add_Data.jsx
  - Uses scalable fetchResource/fetchNested/createResource pattern from Admin Provider.
  - Avoids single monolithic data fetch.
*/

const Admin_Add_Data = () => {
  // =================== GLOBAL STATE & ADMIN CONTEXT ===================
  const [activeTab, setActiveTab] = useState("category");
  const [isUploading, setIsUploading] = useState(false);

  // Destructure scalable functions from the provider
  const { 
    rawGet, // Used for the non-standard occupied steps endpoint
    fetchResource, 
    getCached, // Quick access to sync cache data
    createResource, 
  } = useAdmin();

  // =================== COMPONENT LOCAL STATE FOR RESOURCE DATA ===================
  // These states will hold the comprehensive lists fetched from the API
  const [allCategories, setAllCategories] = useState([]);
  const [allTemplateTypes, setAllTemplateTypes] = useState([]);
  const [allLanguages, setAllLanguages] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [allSections, setAllSections] = useState([]); // CRITICAL: This was missing data/wasn't used correctly

  // =================== FORM STATES (KEPT AS IS) ===================
  const [categoryName, setCategoryName] = useState("");
  const [sectionType, setSectionType] = useState("Frontend"); // Default to Frontend
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

  // =================== COMMON INPUT STYLE ===================
  const formInputStyle = {
    background: "#121212",
    color: "#fff",
    border: "1px solid #555",
    padding: "8px",
    borderRadius: "6px",
  };


  // =================== INITIAL DATA FETCHING ===================
  useEffect(() => {
    // Fetch all necessary resources on mount
    const fetchInitialData = async () => {
      // Note: fetchResource returns cached data if available, otherwise fetches.
      // This is efficient and keeps the data fresh on component load.
      setAllCategories(await fetchResource("categories"));
      setAllTemplateTypes(await fetchResource("template-types"));
      setAllLanguages(await fetchResource("languages"));
      setAllTopics(await fetchResource("topics"));
      setAllSections(await fetchResource("sections")); // Ensure sections are fetched
    };
    fetchInitialData();
  }, [fetchResource]);


  // =================== DERIVED STATE / MEMOIZED FILTERS ===================
  

  // 1. Filter Frontend Languages
  const frontendDesignLanguages = useMemo(() => {
    const frontendSection = allSections.find(s => s.name === "Frontend");
    if (!frontendSection) return [];
    return allLanguages.filter(l => l.section === frontendSection.id);
  }, [allLanguages, allSections]);


  // 2. Filter Backend Languages
  const codeGuideLanguages = useMemo(() => {
    const backendSection = allSections.find(s => s.name === "Backend");
    if (!backendSection) return [];
    return allLanguages.filter(l => l.section === backendSection.id);
  }, [allLanguages, allSections]);


  // 3. Filter Frontend Designs (Topics)
  const frontendDesigns = useMemo(() => {
    return allTopics.filter(t => 
      t.language === parseInt(frontendDesignLanguage, 10)
    );
  }, [allTopics, frontendDesignLanguage]);


  // 4. Filter Backend Guides (Topics)
  const codingGuides = useMemo(() => {
    return allTopics.filter(t => 
      t.language === parseInt(codeGuideLanguage, 10)
    );
  }, [allTopics, codeGuideLanguage]);


// =================== FETCH OCCUPIED STEPS (Dependent on backendTopic) ===================
  useEffect(() => {
    if (!backendTopic) {
      setOccupiedSteps([]);
      return;
    }

    let mounted = true;
    const fetchSteps = async () => {
      try {
        // endpoint to get occupied steps of Backend steps
        const res = await rawGet(
          `/api/backend-steps/occupied-steps/${backendTopic}/`
        );
        if (mounted) setOccupiedSteps(res?.occupied_steps || []);
      } catch (err) {
        console.error("Error fetching occupied steps:", err);
        if (mounted) setOccupiedSteps([]);
      }
    };
    fetchSteps();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendTopic, rawGet]); // rawGet is stable


  // ================================================================
  // ===================== API HANDLERS (Scalable) ==================
  // ================================================================

  // Helper wrapper to set uploading state around async handlers.
  const withUploading = useCallback(async (fn) => {
    setIsUploading(true);
    try {
      await fn();
      // After any successful creation, refresh the relevant top-level data 
      // to ensure dropdowns are current (force refresh with background: true)
      // NOTE: This could be optimized to only refresh the resource that was just created.
      fetchResource("categories", { force: true, background: true });
      fetchResource("template-types", { force: true, background: true });
      fetchResource("languages", { force: true, background: true }); // Important for topic/language dependencies
      fetchResource("topics", { force: true, background: true }); // Important for topic/language dependencies
      
    } finally {
      setIsUploading(false);
    }
  }, [fetchResource]);


  // -------------------- Add Category --------------------
  const handleAddCategory = useCallback(
    async (e) => {
      e.preventDefault();
      if (!categoryName.trim()) return alert("Category name required!");

      await withUploading(async () => {
        try {
          const created = await createResource("categories", {
            name: categoryName,
          });
          setCategoryName("");
          alert(`Category added: ${created.name}!`);
          
          // Manually update local state with server response 
          setAllCategories(prev => [...prev, created]);
          
        } catch (err) {
          console.error("Add category error:", err);
          alert("Error adding category!");
        }
      });
    },
    [categoryName, createResource, withUploading]
  );


  // -------------------- Add Language --------------------
  const handleAddLanguage = useCallback(
    async (e) => {
      e.preventDefault();
      if (!languageName.trim()) return alert("Language name required!");

      await withUploading(async () => {
        try {
          // FIX: Use allSections state instead of undefined 'sections'
          const sec = allSections.find((s) => s.name === sectionType); 
          if (!sec) return alert("Invalid section type selected or sections not loaded.");

          const payload = {
            section: sec.id,
            name: languageName,
            icon_class: icon,
            category: parseInt(categoryId, 10) || null,
          };

          const created = await createResource("languages", payload);
          
          setLanguageName("");
          setIcon("");
          setCategoryId("");
          alert(`Language added: ${created.name}!`);
          
          // Manually update local state 
          setAllLanguages(prev => [...prev, created]);

        } catch (err) {
          console.error("Add language error:", err);
          alert("Error adding language!");
        }
      });
    },
    // FIX: Updated dependency array
    [allSections, sectionType, languageName, icon, categoryId, createResource, withUploading]
  );


  // -------------------- Add Topic --------------------
  const handleAddTopic = useCallback(
    async (e) => {
      e.preventDefault();
      if (!topicLanguage || !topicName.trim()) return alert("Select language and enter name!");

      await withUploading(async () => {
        try {
          const created = await createResource("topics", {
            language: parseInt(topicLanguage, 10),
            name: topicName,
          });
          setTopicName("");
          setTopicLanguage("");
          alert(`Topic added: ${created.name}!`);
          
          // Manually update local state 
          setAllTopics(prev => [...prev, created]);

        } catch (err) {
          console.error("Add topic error:", err);
          alert("Error adding topic!");
        }
      });
    },
    [topicLanguage, topicName, createResource, withUploading]
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

          await createResource("frontend-source-codes", payload);

          // Reset fields
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
      createResource,
      withUploading,
    ]
  );

apA
  // -------------------- Add Backend Step --------------------
  const handleAddBackend = useCallback(
    async (e) => {
      e.preventDefault();
      if (!codeGuideLanguage || !backendTopic)
        return alert("Select language + topic!");

      await withUploading(async () => {
        try {
          // 1. Create the Step (standard resource path)
          const stepPayload = {
            topic: parseInt(backendTopic, 10),
            step_number: parseInt(stepNumber, 10),
            step_file_name: stepFileName,
            step_description: stepDescription,
            step_source_code: stepCode,
          };

          await createResource("backend-steps", stepPayload);

          // 2. If there's image, upload separately 
          if (imageFile) {
            const formData = new FormData();
            formData.append("topic", backendTopic);
            formData.append("image", imageFile);
            
            await createResource("backend-images", formData);
          }
          
          // Reset
          setStepNumber(1);
          setStepFileName("");
          setStepDescription("");
          setStepCode("");
          setcodeGuideLanguage("");
          setBackendTopic("");
          setImageFile(null); // Reset file input

          alert("Backend step added!");
          // Force refresh occupied steps after successful addition
          setOccupiedSteps([]); 
        } catch (err) {
          console.error("Add backend error:", err);
          alert("Error adding backend step or image!");
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
      createResource,
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

          const created = await createResource("templates", payload);
          
          // Reset
          setTemplateTitle("");
          setTemplateInfo("");
          setIframeUrl("");
          setDownloadRepoUrl("");
          setDocumentationUrl("");
          setAccessType("");
          setPrice(0);
          setTemplateType("");

          alert(`Template added successfully: ${created.title}!`);
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
      createResource,
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
            {tab.toUpperCase().replace('-', ' ')}
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
            {/* These options rely on the hardcoded values "Frontend" and "Backend"
                If they are dynamic, you should map over allSections. */}
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
            {/* FIX: Use allCategories state */}
            {allCategories.map((c) => (
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
            {/* FIX: Use allLanguages state */}
            {allLanguages.map((l) => (
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
            onChange={(e) => {
              setfrontendDesignLanguage(e.target.value);
              setFrontendTopic("");
            }}
            className="form-control mb-2"
            style={formInputStyle}
            required
          >
            <option value="">Select Frontend Language</option>
            {/* FIX: Use derived state frontendDesignLanguages */}
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
            disabled={!frontendDesignLanguage}
          >
            <option value="">Select Topic</option>
            {/* FIX: Use derived state frontendDesigns */}
            {frontendDesigns.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* ... other frontend fields ... */}
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
            onChange={(e) => {
              setcodeGuideLanguage(e.target.value);
              setBackendTopic("");
            }}
            className="form-control mb-2"
            style={formInputStyle}
            required
          >
            <option value="">Select Backend Language</option>
            {/* FIX: Use derived state codeGuideLanguages */}
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
            disabled={!codeGuideLanguage}
          >
            <option value="">Select Topic</option>
            {/* FIX: Use derived state codingGuides */}
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
            disabled={!backendTopic}
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
            {/* FIX: Use allTemplateTypes state */}
            {allTemplateTypes.map((t) => (
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
          {/* ... other template fields ... */}
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