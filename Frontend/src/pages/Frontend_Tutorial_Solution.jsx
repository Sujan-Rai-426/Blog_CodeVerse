import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import api from "../api";
import "../assets/css/Frontend_Tutorial_Solution.css";
import { FaCopy } from "react-icons/fa";


// FRONTEND TUTORIAL SOLUTION PAGE COMPONENT
const Frontend_Tutorial_Solution = () => {
    const { topicID } = useParams();
    const topicId = parseInt(topicID);
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!topicID || isNaN(topicId)) {
            console.error("❌ Invalid topic ID:", topicID);
            setLoading(false);
            return;
        }

        const fetchTopic = async () => {
            try {
                const res = await api.get(`/api/topics/${topicId}/`);
                setTopic(res.data);
            } catch (error) {
                console.error("❌ Error fetching topic:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopic();
    }, [topicID]);

    useEffect(() => {
        Prism.highlightAll();
    }, [topic]);

    if (loading) return <p className="text-center mt-5">Loading topic...</p>;
    if (!topic) return <p className="text-center mt-5">❌ Topic not found</p>;

    const CopyButton = ({ code }) => {
        const [copied, setCopied] = useState(false);
        const handleCopy = () => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };
        return (
            <button className="copy-btn" onClick={handleCopy}>
                <FaCopy /> {copied ? "Copied!" : "Copy"}
            </button>
        );
    };

    return (
        <div className="container py-1 px-1">
            <h4 className="text-center mb-3text-primary">
                <b>🎬 Responsive Designs:</b><br /> <small>{topic.name}</small>
            </h4>

<br />      

            {/* Videos */}
            {topic.videos?.length > 0 && (
                <div>
                    {topic.videos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            )}
        </div>
    );
};



// VIDEO CARD COMPONENT
const VideoCard = ({ video }) => {
    const [selectedTab, setSelectedTab] = useState("html"); //default start should be on css

    const getCodeByTab = (codeObj, tab) => {
        switch (tab) {
            case "html": return codeObj.html_code || "";
            case "css": return codeObj.css_code || "";
            case "js": return codeObj.js_code || "";
            default: return "";
        }
    };

    const CopyButton = ({ code }) => {
        const [copied, setCopied] = useState(false);
        const handleCopy = () => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };
        return <button className="copy-btn" onClick={handleCopy}><FaCopy /> {copied ? "Copied!" : "Copy"}</button>;
    };

    useEffect(() => {
        Prism.highlightAll();
    }, [selectedTab]);

    return (
        <div className="card video-card mb-5 p-1 shadow-lg rounded-4">
            {/* <h4 className="fw-semibold mb-3"><b>{video.title}</b></h4> */}

            <div className="video-container">
                {/* Video */}
                <div className="video-wrapper">
                    <div className="card shadow border-0" style={{ borderRadius: "20px", overflow: "hidden", height: "100%" }}>
                        <video src={video.video_url} autoPlay loop muted playsInline className="w-100 h-100" />
                    </div>
                </div>

                {/* Code Box */}
                <div className="code-info-wrapper">
                    {video.source_codes?.length > 0 && video.source_codes.map((codeObj, idx) => (
                        <div key={idx} className="card shadow-lg mb-1 d-flex flex-column h-100">
                            <div className="card-header">
                                <div className="btn-group">
                                    {["html","css","js"].map(tab => (
                                        <button key={tab} className={`btn-tab ${selectedTab === tab ? "active-tab" : ""}`} onClick={() => setSelectedTab(tab)}>
                                            {tab.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                <CopyButton code={getCodeByTab(codeObj, selectedTab)} />
                            </div>
                            <div className="card-body code-box">
                                <pre className="m-0">
                                    <code className={`language-${selectedTab}`}>{getCodeByTab(codeObj, selectedTab)}</code>
                                </pre>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {video.info?.description && <p className="video-description"><b> NOTE : </b> {video.info.description}</p>}
        </div>
    );
};

export default Frontend_Tutorial_Solution;
