import React, { useEffect, useState } from "react";
import "../assets/css/Admin_Dashboard.css";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Admin_Dashboard = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [sections, setSections] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [icon, setIcon] = useState("");

    const [activeTab, setActiveTab] = useState("language"); // language, topic, frontend, backend

    // ---------- Form States ----------
    const [sectionType, setSectionType] = useState("Frontend");
    const [categoryId, setCategoryId] = useState("");
    const [languageName, setLanguageName] = useState("");
    const [topicName, setTopicName] = useState("");
    const [topicLanguage, setTopicLanguage] = useState("");



    // Frontend
    const [frontendLanguage, setFrontendLanguage] = useState("");
    const [frontendTopic, setFrontendTopic] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [htmlCode, setHtmlCode] = useState("");
    const [cssCode, setCssCode] = useState("");
    const [jsCode, setJsCode] = useState("");
    const [frontendDesc, setFrontendDesc] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    
    // Backend
    const [backendLanguage, setBackendLanguage] = useState("");
    const [backendTopic, setBackendTopic] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [stepNumber, setStepNumber] = useState(1);
    const [stepTitle, setStepTitle] = useState("");
    const [stepDescription, setStepDescription] = useState("");
    const [stepCode, setStepCode] = useState("");



    // ---------- Fetch Categories api ----------
    const fetchCategories = async () => {
        try {
            const res = await api.get("/api/categories/");
            setCategories(res.data);
            setSections(res.data.flatMap(c => c.sections || []));
            setLanguages(res.data.flatMap(c => c.sections?.flatMap(s => s.languages) || []));
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);


    // ---------- Derived dropdown lists ----------
    const frontendLanguages = sections
        .find(s => s.name.toLowerCase() === "frontend")
        ?.languages || [];

    const backendLanguages = sections
        .find(s => s.name.toLowerCase() === "backend")
        ?.languages || [];

    const frontendTopics = frontendLanguages.find(l => l.id === parseInt(frontendLanguage))?.topics || [];
    const backendTopics = backendLanguages.find(l => l.id === parseInt(backendLanguage))?.topics || [];

    const topicLangOptions = languages; // For topic tab dropdown


        // ---------- Logout Handler ----------
    const handleLogout = () => {
        window.localStorage.removeItem("loggedIn"); // remove login flag
        navigate("/Admin_Login"); // redirect to login
    };


    // ----FETCH AND HANDLE ADDITION OF LANGUAGE----
    const handleAddLanguage = async (e) => {
        e.preventDefault();
        try {
            setIsUploading(true);
            const sec = sections.find(s => s.name === sectionType);
            if (!sec) return alert("Section not selected");
            await api.post("/api/languages/", { section: sec.id, name: languageName, icon_class: icon });
            // Reset from fields
            setLanguageName("");
            setIcon("");
            fetchCategories();
            alert("Language added successfully!");
        } catch (err) {
            console.error(err.response ? err.response.data : err);
            alert("Error adding language!");
        }   finally {
        setIsUploading(false);
    }
    };



    // ----FETCH AND HANDLE ADDITION OF TOPIC----
    const handleAddTopic = async (e) => {
        e.preventDefault();
        if (!topicLanguage) return alert("Please select a language");
        try {
            setIsUploading(true);
            await api.post("/api/topics/", { language: topicLanguage, name: topicName });
            setTopicName("");
            fetchCategories();
            alert("Topic added successfully!");
        } catch (err) {
            console.error(err.response ? err.response.data : err);
            alert(err.response?.data?.error || "Error adding topic!");
        }   finally {
        setIsUploading(false);
    }
    };



    // ----FETCH AND HANDLE ADDITION OF FRONTEND CONTENT----
const handleAddFrontend = async (e) => {
    e.preventDefault();

    if (!frontendLanguage || !frontendTopic || !videoFile) {
        return alert("Please select language, topic, and upload a video file");
    }

    try {
        setIsUploading(true);

        // -----------------  Upload Video -----------------
        const videoFormData = new FormData();
        videoFormData.append("topic", frontendTopic);  // topic ID
        videoFormData.append("title", String(frontendDesc || "Untitled Video")); // ensure string
        videoFormData.append("video_url", videoFile);

        const videoRes = await api.post("/api/frontendvideos/", videoFormData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        const videoId = videoRes.data.id;  // ID of the uploaded video
        console.log("Video uploaded with ID:", videoId);

        // ----------------- Add Video Info (description) -----------------
        if (frontendDesc) {
            const infoRes = await api.post("/api/frontendvideoinfo/", {
                video: videoId,
                description: String(frontendDesc),
            });
            console.log("Video description saved:", infoRes.data);
        }

        // -----------------  Add Source Codes -----------------
        if (htmlCode || cssCode || jsCode) {
            const codeRes = await api.post("/api/frontendsourcecodes/", {
                video: videoId,
                html_code: String(htmlCode || ""),
                css_code: String(cssCode || ""),
                js_code: String(jsCode || ""),
            });
            console.log("Source code saved:", codeRes.data);
        }

        // -----------------  Reset Fields -----------------
        setVideoFile(null);
        setHtmlCode("");
        setCssCode("");
        setJsCode("");
        setFrontendDesc("");
        setFrontendTopic("");
        setFrontendLanguage("");

        alert("✅ Frontend content added successfully!");
    } catch (err) {
        console.error("Error adding frontend content:", err.response ? err.response.data : err);
        alert("❌ Error adding frontend content! Check console for details.");
    } finally {
        setIsUploading(false);
    }
};



    // ----FETCH AND HANDLE ADDITION OF BACKEND STEP----
    const handleAddBackend = async (e) => {
        e.preventDefault();
        
        if (!backendLanguage || !backendTopic) {
            return alert("Please select language and topic");
        }

        try {
            setIsUploading(true);

            // ----------  Create the backend step ----------
            const stepPayload = {
                topic: parseInt(backendTopic),   // topic ID
                step_number: parseInt(stepNumber),
                step_title: stepTitle,
                step_description: stepDescription,
                step_source_code: stepCode,
            };

            const stepResponse = await api.post("/api/backendsteps/", stepPayload);

            // ----------  If an image is selected, upload it ----------
            if (imageFile) {
                const formData = new FormData();
                formData.append("topic", backendTopic); // topic ID
                formData.append("image", imageFile);

                await api.post("/api/backendimages/", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            // ----------  Reset all fields ----------
            setStepNumber(1);
            setStepTitle("");
            setStepDescription("");
            setStepCode("");
            setImageFile(null);
            setBackendLanguage("");
            setBackendTopic("");

            alert("Backend step and image added successfully!");
        } catch (err) {
            console.error("Backend add error:", err.response ? err.response.data : err);
            alert("Error! Step number already exists");
        }   finally {
        setIsUploading(false);
    }
    };



    //  Fetch occupied step numbers when backendTopic changes
    const [occupiedSteps, setOccupiedSteps] = useState([]);
    useEffect(() => {
        const fetchOccupiedSteps = async () => {
            if (backendTopic) {
                try {
                    const res = await api.get(`/api/backendsteps/occupied-steps/${backendTopic}/`);
                    setOccupiedSteps(res.data.occupied_steps);
                } catch (err) {
                    console.error("Error fetching occupied steps:", err);
                }
              } else {
                  setOccupiedSteps([]);
              }
        };
        fetchOccupiedSteps();
    }, [backendTopic]);


    
    return (
        <div className="admin-dashboard my-5 ">
                <h4 className="mb-4">Admin Dashboard </h4>

            {/* Tabs */}
            <div className="btn-group mb-4">
                <button className={`btn btn-outline-primary ${activeTab==="language" ? "active":""}`} onClick={() => setActiveTab("language")}>Language</button>
                <button className={`btn btn-outline-primary ${activeTab==="topic" ? "active":""}`} onClick={() => setActiveTab("topic")}>Topic</button>
                <button className={`btn btn-outline-success ${activeTab==="frontend" ? "active":""}`} onClick={() => setActiveTab("frontend")}>Frontend</button>
                <button className={`btn btn-outline-danger ${activeTab==="backend" ? "active":""}`} onClick={() => setActiveTab("backend")}>Backend</button>
            </div>


            {/* ---------- LANGUAGE ---------- */}
            {activeTab === "language" && (
                <form onSubmit={handleAddLanguage} className="mb-4">
                    <h4>Add Language</h4>
                    <select className="form-control mb-2" value={sectionType} onChange={(e) => setSectionType(e.target.value)}>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                    </select>
                    <select className="form-control mb-2" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>

                    {/* language name */}
                    <input type="text" placeholder="Language Name" value={languageName} onChange={(e) => setLanguageName(e.target.value)} className="form-control mb-2" required />
                        
                        {/* 🔹 Icon Class Field */}
                    <input type="text" placeholder="Icon Class (e.g., devicon-python-plain colored)" value={icon} onChange={(e) => setIcon(e.target.value)} className="form-control mb-2" required />

                    <div style={{ display:"flex" ,justifyContent:"space-between", margin: "0 1vw" }}>
                        <button  type="submit"  className="btn btn-success"  disabled={isUploading} >
                            {isUploading ? (
                                    <>
                                        <span  className="spinner-border spinner-border-sm me-2"  role="status"  aria-hidden="true" ></span>
                                        Uploading...
                                    </>
                                ) : (
                                    "Add Language"
                                )}
                        </button>
                        <button className="btn btn-danger" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </form>
            )}


            {/* ---------- TOPIC ---------- */}
            {activeTab === "topic" && (
                <form onSubmit={handleAddTopic} className="mb-4">
                    <h4>Add Topic</h4>
                    <select className="form-control mb-2" value={topicLanguage} onChange={(e) => setTopicLanguage(e.target.value)} required>
                        <option value="">Select Language</option>
                        {topicLangOptions.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                    <input type="text" placeholder="Topic Name" value={topicName} onChange={(e) => setTopicName(e.target.value)} className="form-control mb-2" required />
                    
                    <div style={{ display:"flex" ,justifyContent:"space-between", margin: "0 1vw" }}>
                        <button  type="submit"  className="btn btn-success"  disabled={isUploading} >
                            {isUploading ? (
                                    <>
                                        <span  className="spinner-border spinner-border-sm me-2"  role="status"  aria-hidden="true" ></span>
                                        Uploading...
                                    </>
                                ) : (
                                    "Add Topic"
                                )}
                        </button>
                        <button className="btn btn-danger" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </form>
            )}


            {/* ---------- FRONTEND ---------- */}
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
                    <textarea placeholder="HTML Code" value={htmlCode} onChange={(e) => setHtmlCode(e.target.value)} className="form-control mb-2" />
                    <textarea placeholder="CSS Code" value={cssCode} onChange={(e) => setCssCode(e.target.value)} className="form-control mb-2" />
                    <textarea placeholder="JS Code" value={jsCode} onChange={(e) => setJsCode(e.target.value)} className="form-control mb-2" />
                    <textarea placeholder="Description" value={frontendDesc} onChange={(e) => setFrontendDesc(e.target.value)} className="form-control mb-2" />
                    
                    <div style={{ display:"flex" ,justifyContent:"space-between", margin: "0 1vw" }}>
                        <button  type="submit"  className="btn btn-success"  disabled={isUploading} >
                            {isUploading ? (
                                    <>
                                        <span  className="spinner-border spinner-border-sm me-2"  role="status"  aria-hidden="true" ></span>
                                        Uploading...
                                    </>
                                ) : (
                                    "Add Frontend Content"
                                )}
                        </button>

                        <button className="btn btn-danger" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>

                </form>
            )}


            {/* ---------- BACKEND ---------- */}
            {activeTab === "backend" && (
                <form onSubmit={handleAddBackend} className="mb-4">
                    <h4>Add Backend Step</h4>

                    <select className="form-control mb-2" value={backendLanguage} onChange={(e) => setBackendLanguage(e.target.value)} required >
                        <option value="">Select Backend Language</option>
                        {backendLanguages.map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                    </select>

                    <select className="form-control mb-2" value={backendTopic} onChange={(e) => setBackendTopic(e.target.value)} required >
                        <option value="">Select Topic</option>
                        {backendTopics.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>

                    <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="form-control mb-2" />

                    {/* Step number input with occupied step list */}
                    <div className="mb-3">
                        <label>Step Number</label>
                        <input type="number" value={stepNumber} onChange={(e) => setStepNumber(e.target.value)} className="form-control" placeholder="Enter Step Number" />
                        {occupiedSteps.length > 0 && (
                            <small className="text-muted">
                                Occupied Step Numbers: {occupiedSteps.join(", ")}
                            </small>
                        )}
                    </div>

                    <input type="text" placeholder="Step Title" value={stepTitle} onChange={(e) => setStepTitle(e.target.value)} className="form-control mb-2" />

                    <textarea placeholder="Step Description" value={stepDescription} onChange={(e) => setStepDescription(e.target.value)} className="form-control mb-2" />

                    <textarea placeholder="Step Source Code" value={stepCode} onChange={(e) => setStepCode(e.target.value)} className="form-control mb-2" />

                    <div style={{ display:"flex" ,justifyContent:"space-between", margin: "0 1vw" }}>
                        <button  type="submit"  className="btn btn-success"  disabled={isUploading} >
                            {isUploading ? (
                                    <>
                                        <span  className="spinner-border spinner-border-sm me-2"  role="status"  aria-hidden="true" ></span>
                                        Uploading...
                                    </>
                                ) : (
                                    "Add Backend Content"
                                )}
                        </button>

                        <button className="btn btn-danger" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </form>
            )}
        </div>

    );
};

export default Admin_Dashboard;
