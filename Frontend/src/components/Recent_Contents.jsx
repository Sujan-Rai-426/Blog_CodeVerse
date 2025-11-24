// ============================
// Recent_Contents.jsx (FINAL)
// ============================

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../assets/css/Recent_Contents.css";
import { Parent_API_Provider_Context } from "../context/Parent_API_Provider";

export default function Recent_Contents() {
    const { data, loading, error } = useContext(Parent_API_Provider_Context);
    const navigate = useNavigate();

    if (loading) {
        return (
            <SkeletonTheme baseColor="#1c1c1c" highlightColor="#2a2a2a">
                <div className="row g-4">
                    {[1, 2, 3].map((i) => (
                        <div className="col-12 col-md-6 col-lg-4" key={i}>
                            <div className="card shadow-sm border-0 rounded-4 overflow-hidden tutorial-card p-2">
                                <Skeleton height={200} borderRadius={10} />
                                <div className="card-body py-2">
                                    <Skeleton width="70%" height={20} className="mb-2 mt-3" />
                                    <Skeleton width="90%" height={14} count={2} />
                                    <Skeleton width={100} height={30} borderRadius={20} className="mt-3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </SkeletonTheme>
        );
    }

    if (error) {
        return <p className="text-center text-danger py-5">Failed to load tutorials.</p>;
    }

    // ------------------------------------------
    // FLATTEN API DATA EXACTLY LIKE Components_Design
    // ------------------------------------------
    const tutorials =
        data?.flatMap((cat) =>
            (cat.sections || []).flatMap((sec) =>
                (sec.languages || []).flatMap((lang) =>
                    (lang.topics || []).flatMap((topic) =>
                        (topic.videos || []).map((video) => {
                            const codeObj = video.source_codes?.[0];

                            return {
                                videoId: video.id,
                                topicId: topic.id,
                                topicName: topic.name,

                                html: codeObj?.html_code || "",
                                css: codeObj?.css_code || "",
                                js: codeObj?.js_code || "",

                                desc: video.info?.description || "",
                                access_type: codeObj?.access_type || "Free"
                            };
                        })
                    )
                )
            )
        ) || [];

    const sortedTutorials = tutorials.sort((a, b) => b.videoId - a.videoId);

    const handleNavigate = (topicId, videoId) => {
        navigate(`/Frontend_Tutorial_Solution/${topicId}/${videoId}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="g-4 recent-cards-container">
            {sortedTutorials.slice(0, 6).map((tutorial) => {
                const isPremium = tutorial.access_type?.toLowerCase() === "premium";

                // -----------------------------
                // iframe document builder
                // -----------------------------
                const usesChart = tutorial.js.includes("Chart(") || tutorial.js.includes("new Chart");

                const iframeDoc = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { margin: 0; padding: 0; }
                            ${tutorial.css}
                        </style>

                        ${usesChart
                            ? `<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>`
                            : ""
                        }
                    </head>
                    <body>
                        ${tutorial.html}

                        <script>
                            try {
                                ${tutorial.js.replace(/<\/script>/g, "<\\/script>")}
                            } catch (err) {
                                console.error("Preview JS Error:", err);
                            }
                        </script>
                    </body>
                    </html>
                `;


                return (
                    <div key={tutorial.videoId}>
                        <div
                            className="card shadow-sm border-0 rounded-4 overflow-hidden tutorial-card position-relative"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNavigate(tutorial.topicId, tutorial.videoId);
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="video-container position-relative">

                                {/* IFRAME FIXED HEIGHT */}
                                <iframe
                                    className="iframe-preview"
                                    srcDoc={iframeDoc}
                                    sandbox="allow-scripts allow-same-origin"
                                ></iframe>

                                {/* Premium Badge */}
                                {isPremium && (
                                    <div className="premium-badge-top-right">
                                        <div className="dollor-box-top-right">
                                            <i className="bi bi-currency-dollar"></i>
                                        </div>
                                        PREMIUM
                                    </div>
                                )}
                            </div>

                            <div className="card-body py-2">
                                <h5 className="recent-card-title">{tutorial.topicName}</h5>

                                <button
                                    className="btn btn-outline-warning btn-sm rounded-pill"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNavigate(tutorial.topicId, tutorial.videoId);
                                    }}
                                >
                                    View Code →
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
