import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../assets/css/Recent_Contents.css"; 
import { Parent_API_Provider_Context } from "../context/Parent_API_Provider";  

function Recent_Contents() {
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

    // Flatten tutorials safely from nested data
    const tutorials = data?.flatMap(cat =>
        (cat.sections || []).flatMap(sec =>
            (sec.languages || []).flatMap(lang =>
                (lang.topics || []).flatMap(topic =>
                    (topic.videos || []).map(video => ({
                        videoId: video.id,
                        topicId: topic.id,
                        topicName: topic.name,
                        title: video.title || topic.name,
                        desc: video.info?.description || "No description available",
                        video_url: video.video_url,
                        access_type: video.source_codes || video.access_type,
                    }))
                )
            )
        )
    ) || [];

    // Sort by latest videoId
    const sortedTutorials = tutorials.sort((a, b) => b.videoId - a.videoId);

    const handleNavigate = (topicId, videoId) => {
        navigate(`/Frontend_Tutorial_Solution/${topicId}/${videoId}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="row g-4">
            {sortedTutorials.length === 0 ? (
                <p className="text-center text-muted py-5">No recent tutorials found.</p>
            ) : (
                sortedTutorials.slice(0, 3).map((tutorial) => {
                    let accessTypeString = "";
                    if (Array.isArray(tutorial.access_type) && tutorial.access_type.length > 0) {
                        accessTypeString = tutorial.access_type[0]?.access_type || "";
                    } else if (tutorial.access_type && typeof tutorial.access_type === "string") {
                        accessTypeString = tutorial.access_type;
                    }

                    const isPremium = accessTypeString.trim().toLowerCase() === "premium";

                    return (
                        <div className="col-12 col-md-6 col-lg-4" key={`${tutorial.videoId}-${tutorial.topicId}`}>
                            <div
                                className="card shadow-sm border-0 rounded-4 overflow-hidden tutorial-card position-relative"
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent parent click events if any
                                    handleNavigate(tutorial.topicId, tutorial.videoId);

                                    // Scroll to top after a slight delay to ensure navigation is complete
                                    setTimeout(() => {
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }, 100);
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="video-container position-relative">
                                    {tutorial.video_url ? (
                                        <video
                                            src={tutorial.video_url}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            className="w-100"
                                            style={{ height: "200px", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <img
                                            src="https://via.placeholder.com/400x200"
                                            className="card-img-top"
                                            alt={tutorial.title}
                                            style={{ height: "200px", objectFit: "cover" }}
                                        />
                                    )}

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
                                    <h5 className="card-title fw-bold">&nbsp; {tutorial.topicName}</h5>
                                    <p className="card-text text-white">&nbsp;&nbsp; {tutorial.desc.slice(0, 50)}...</p>
                                    &nbsp;&nbsp;
                                    <button
                                        className="btn btn-outline-warning btn-sm rounded-pill"
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            handleNavigate(tutorial.topicId, tutorial.videoId);

                                            // Scroll to top AFTER navigation
                                            setTimeout(() => {
                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                            }, 100);
                                        }}
                                    >
                                        View Code →
                                    </button>

                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default Recent_Contents;
