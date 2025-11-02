import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import "../assets/css/Backend_Tutorial_Solution.css";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import { Copy } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Backend_Tutorial_Solution = () => {
    const { topicID } = useParams();
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copiedStep, setCopiedStep] = useState(null);

    const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dusqlukhy/";

    useEffect(() => {
        const fetchBackendTopic = async () => {
            try {
                const res = await api.get(`/api/topics/${topicID}/`);
                const { data } = res;
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

    // Copy code button
    const handleCopy = (code, stepId) => {
        navigator.clipboard.writeText(code);
        setCopiedStep(stepId);
        setTimeout(() => setCopiedStep(null), 2000);
    };

    // === Skeleton Loader Layout ===
    if (loading) {
        return (
            <div className="container py-4" style={{ minHeight: "100vh" }}>
                <SkeletonTheme baseColor="#1c1c1c" highlightColor="#2a2a2a">
                <h2 className="text-center mb-4">
                    <Skeleton width={280} height={32} />
                </h2>

                <div className="row">
                    {/* Steps Skeleton */}
                    <div className="col-lg-7 mb-4">
                        <h4 className="text-center mb-3">
                            <Skeleton width={120} />
                        </h4>

                        {[1, 2, 3].map((i) => (
                            <div key={i} className="card mb-4 shadow-sm border-0 rounded-4 p-3" >
                                <Skeleton height={25} width="60%" />
                                <Skeleton height={18} width="80%" className="mt-2" />
                                <Skeleton height={160} className="mt-3 rounded-3" />
                            </div>
                        ))}
                    </div>

                    {/* Image Preview Skeleton */}
                    <div className="col-lg-5">
                        <h4 className="text-center mb-3">
                            <Skeleton width={160} />
                        </h4>
                        {[1, 2].map((i) => (
                            <div key={i} className="card shadow-sm mb-3 rounded-4 overflow-hidden" >
                                <Skeleton height={250} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-4">
                    <Skeleton width={180} height={40} borderRadius={20} />
                </div>
                </SkeletonTheme>
            </div>
        );
    }

    // === Error Message ===
    if (error)
        return <p className="text-danger text-center py-5">{error}</p>;

    if (!topic) return null;

    // === Actual Content ===
    return (
        <div className="container py-3" style={{ minHeight: "100vh" }}>
            <h2 className="mb-3 mt-3 fw-bold text-center">{topic.name}</h2>

            <div className="row">
                {/* Steps Section */}
                <div className="col-lg-7 mb-4 mb-lg-0 code-steps px-0">
                    <h4 className="mb-2 mt-4 fw-semibold text-center">
                        <small>-Steps-</small>
                    </h4>

                    {topic.steps.map((step) => (
                        <div key={step.id} className="card mb-4 shadow-sm border-0 rounded-4" >
                            <div className="card-body">
                                <h5 className="fw-bold text-primary mb-0 mt-2">
                                    Step {step.step_number}: {step.step_file_name}
                                </h5>

                                {step.step_description && (
                                    <p className="text-muted m-0">{step.step_description}</p>
                                )}

                                {step.step_source_code && (
                                    <div className="code-container position-relative">
                                        <button className="copy-btn" onClick={() => handleCopy(step.step_source_code, step.id) } >
                                            {copiedStep === step.id ? "✅ Copied!" : <Copy size={18} />}
                                        </button>
                                        <pre className="language-javascript code-block">
                                            <code className="language-javascript">
                                                {step.step_source_code}
                                            </code>
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Images Section */}
                {topic.images?.length > 0 && (
                    <div className="col-lg-5 px-4">
                        <h4 className="mb-2 mt-3 fw-semibold text-center">
                            <small>-File Formate-</small>
                        </h4>
                        {topic.images.map((img) => (
                            <div key={img.id} className="card shadow-sm mb-3 rounded-4 overflow-hidden" >
                                <img src={`${CLOUDINARY_BASE_URL}${img.image}`} alt={`Backend step ${img.id}`} className="img-fluid" style={{ objectFit: "cover", width: "100%", height: "250px", }} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="text-center mt-3">
                <Link to="/" className="btn btn-outline-primary btn-lg">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
};

export default Backend_Tutorial_Solution;
