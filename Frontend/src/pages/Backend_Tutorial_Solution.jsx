import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import "../assets/css/Backend_Tutorial_Solution.css";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import { Copy } from "lucide-react"; // modern lightweight icon

const Backend_Tutorial_Solution = () => {
    const { topicID } = useParams();
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copiedStep, setCopiedStep] = useState(null); // track which step was copied

    const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dusqlukhy/";

    useEffect(() => {
        const fetchBackendTopic = async () => {
            try {
                const res = await api.get(`/api/topics/${topicID}/`);
                const {data} = res;
                if (data.images || data.steps) {
                    setTopic(data);
                    setTimeout(() => Prism.highlightAll(), 0);
                } else {
                    setError("This topic does not belong to Backend or has no content.");
                }
                
            } catch (err) {
                console.error("Error fetching backend topic:", err);
                setError("Failed to fetch topic data.");
            } finally {
                setLoading(false);
            }
        };
        fetchBackendTopic();
    }, [topicID]);

    // Copy button handler
    const handleCopy = (code, stepId) => {
        navigator.clipboard.writeText(code);
        setCopiedStep(stepId);
        setTimeout(() => setCopiedStep(null), 2000);
    };

    if (loading) return <p className="text-center py-5 fw-bold">Loading topic...</p>;
    if (error) return <p className="text-danger text-center py-5">{error}</p>;
    if (!topic) return null;

    return (
        <div className="container py-5" style={{ minHeight: "100vh" }}>
            <h2 className="mb-5 fw-bold text-center">{topic.name}</h2>

            <div className="row">
                {/* Steps on left */}
                <div className="col-lg-7 mb-4 mb-lg-0 code-steps">
                    <h4 className="mb-4 fw-semibold">Steps</h4>
                    {topic.steps.map((step) => (
                        <div key={step.id} className="card mb-4 shadow-sm border-0 rounded-4">
                            <div className="card-body">
                                <h5 className="fw-bold text-primary mb-2">
                                    Step {step.step_number}: {step.step_title}
                                </h5>

                                {step.step_description && (
                                    <p className="text-muted mb-3">{step.step_description}</p>
                                )}

                                {step.step_source_code && (
                                    <div className="code-container position-relative">
                                        <button className="copy-btn" onClick={() => handleCopy(step.step_source_code, step.id)} >
                                                {copiedStep === step.id ? "✅ Copied!" : <Copy size={18} />}
                                        </button>
                                        <pre className="language-javascript code-block">
                                            <code className="language-javascript">{step.step_source_code}</code>
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                    
                {/* Images on right */}
                {topic.images?.length > 0 && (
                    <div className="col-lg-5">
                        <h4 className="mb-4 fw-semibold">Images</h4>
                        {topic.images.map((img) => (
                            <div key={img.id} className="card shadow-sm mb-3 rounded-4 overflow-hidden">
                                <img src={`${CLOUDINARY_BASE_URL}${img.image}`} alt={`Backend step ${img.id}`} className="img-fluid" style={{ objectFit: "cover", width: "100%", height: "250px" }} />
                                
                            </div>
                        ))}
                    </div>
                )}
            </div>

                {/* Back Button */}
                <div className="text-center mt-5">
                        <Link to='/' className="btn btn-outline-primary btn-lg">
                            ← Back to Home
                        </Link>
                </div>
        </div>
    );
};

export default Backend_Tutorial_Solution;
