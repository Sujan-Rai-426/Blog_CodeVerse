import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import { Copy } from "lucide-react";
import "../assets/css/Backend_Tutorial_Solution.css";
import { Parent_API_Provider_Context } from "../context/Parent_API_Provider"; 

const Backend_Tutorial_Solution = () => {
    const { topicID } = useParams();
    const { data, loading, error } = useContext(Parent_API_Provider_Context);
    const [topic, setTopic] = useState(null);
    const [copiedStep, setCopiedStep] = useState(null);
    const [zoomedImage, setZoomedImage] = useState(null);

    const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dusqlukhy/";

    // Flatten all topics from nested data
    const getAllTopics = () => {
        return data
            ?.flatMap(category => category.sections || [])
            ?.flatMap(section => section.languages || [])
            ?.flatMap(language => language.topics || []) || [];
    };

    // Find topic by ID
    useEffect(() => {
        if (!data) return;
        const topicsData = getAllTopics();
        const foundTopic = topicsData.find(t => String(t.id) === String(topicID));
        setTopic(foundTopic || null);
    }, [topicID, data]);

    // Highlight code after render
    useEffect(() => {
        if (topic?.steps?.length) {
            const timer = setTimeout(() => Prism.highlightAll(), 50);
            return () => clearTimeout(timer);
        }
    }, [topic]);

    const getPrismLang = (lang) => {
        if (!lang) return "javascript";
        const map = { js: "javascript", javascript: "javascript", py: "python", python: "python" };
        return map[lang.toLowerCase()] || lang.toLowerCase();
    };

    const handleCopy = (code, stepId) => {
        navigator.clipboard.writeText(code);
        setCopiedStep(stepId);
        setTimeout(() => setCopiedStep(null), 2000);
    };

    if (loading) return <p className="text-center py-5">⏳ Loading topic...</p>;
    if (error) return <p className="text-center py-5 text-danger">❌ Error loading topic</p>;
    if (!topic) return (
        <div className="text-center py-5">
            ❌ Topic not found or not loaded yet.
            <br />
            <Link to="/" className="btn btn-outline-danger mt-3">← Back to Home</Link>
        </div>
    );

    return (
        <div className="container py-3" style={{ minHeight: "100vh" }}>
            <h2 className="mb-3 mt-3 fw-bold text-center text-warning">{topic.name}</h2>
            <div className="row">
                {/* Steps */}
                <div className="col-lg-7 mb-4 mb-lg-0 code-steps px-0">
                    <h4 className="mb-2 mt-4 fw-semibold text-center"><small>-Steps-</small></h4>
                    {topic.steps?.length ? (
                        topic.steps.map((step) => {
                            const prismLang = getPrismLang(step.step_language);
                            return (
                                <div key={step.id} className="card mb-4 shadow-sm border-0 rounded-4">
                                    <div className="card-body backend-card">
                                        <h5 className="fw-bold text-warning mb-0 mt-3 px-1">
                                            Step {step.step_number}: <small>{step.step_file_name}</small>
                                        </h5>
                                        {step.step_description && (
                                            <p className="text-muted m-0 text-content py-2 px-2">{step.step_description}</p>
                                        )}
                                        {step.step_source_code && (
                                            <div className="code-container position-relative">
                                                <button
                                                    className="copy-btn"
                                                    onClick={() => handleCopy(step.step_source_code, step.id)}
                                                >
                                                    {copiedStep === step.id ? "✅ Copied!" : <Copy size={18} />}
                                                </button>
                                                <pre className={`language-${prismLang} code-block`}>
                                                    <code className={`language-${prismLang}`}>
                                                        {step.step_source_code}
                                                    </code>
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-muted py-3">Steps will be uploaded soon...</p>
                    )}
                </div>

                {/* Images */}
                {topic.images?.length ? (
                    <div className="col-lg-5 px-4">
                        <h4 className="mb-2 mt-3 fw-semibold text-center"><small>-File Format-</small></h4>
                        {topic.images.map((img) => (
                            <div key={img.id} className="card shadow-sm mb-3 rounded-4 overflow-hidden">
                                <img
                                    src={`${CLOUDINARY_BASE_URL}${img.image}`}
                                    alt={`Backend step ${img.id}`}
                                    className="img-fluid preview-img"
                                    onClick={() => setZoomedImage(`${CLOUDINARY_BASE_URL}${img.image}`)}
                                    loading="lazy"
                                />
                            </div>
                        ))}
                        {zoomedImage && (
                            <div className="image-popup" onClick={() => setZoomedImage(null)}>
                                <img src={zoomedImage} alt="Full preview" />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="col-lg-5 px-4">
                        <p className="text-center text-muted mt-4">No images uploaded yet...</p>
                    </div>
                )}
            </div>

            <div className="text-center mt-3">
                <Link to="/" className="btn btn-outline-danger btn-lg">← Back to Home</Link>
            </div>
        </div>
    );
};

export default Backend_Tutorial_Solution;
