import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../assets/css/Recent_Contents.css"; // 👈 new css file for premium styling

function Recent_Contents() {
    const [tutorials, setTutorials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await api.get("/api/topics/");
                const topics = response.data;
                const frontendLanguageIds = [1, 11]; // frontend (HTML, JS, React)

                const allVideos = [];
                topics.forEach((topic) => {
                    if (topic.videos && topic.videos.length > 0) {
                        const isFrontend = frontendLanguageIds.includes(topic.language);
                        const type = isFrontend ? "frontend" : "backend";

                        topic.videos.forEach((video) => {
                        allVideos.push({
                            id: video.id,
                            topicId: topic.id,
                            title: topic.name,
                            author: type.charAt(0).toUpperCase() + type.slice(1),
                            desc: video.info?.description || "No description available",
                            video_url: video.video_url,
                            access_type: video.access_type, // 👈 added for premium check
                            type,
                        });
                        });
                    }
                });

                const sortedVideos = allVideos.sort((a, b) => b.id - a.id);
                const latestThree = sortedVideos.slice(0, 3);
                setTutorials(latestThree);
            } catch (error) {
                console.error("Error fetching tutorials:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

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

    return (
        <div className="row g-4">
            {tutorials.length === 0 ? (
                <p className="text-center text-muted py-5">No recent tutorials found.</p>
            ) : (
                tutorials.map((tutorial) => (
                    <div className="col-12 col-md-6 col-lg-4" key={tutorial.id}>
                        <div className="card shadow-sm border-0 rounded-4 overflow-hidden tutorial-card position-relative">
                            <div className="video-container position-relative">
                                {tutorial.video_url ? (
                                        <video src={tutorial.video_url} autoPlay muted loop playsInline className={`w-100 ${ tutorial.access_type === "Premium" ? "blurred-video" : "" }`} style={{ height: "200px", objectFit: "cover" }} />
                                    ) : (
                                        <img src="https://via.placeholder.com/400x200" className="card-img-top" alt={tutorial.title} style={{ height: "200px", objectFit: "cover" }} />
                                    )}

                                {/* 💰 Center Premium Badge */}
                                {tutorial.access_type === "Premium" && (
                                    <div className="premium-badge-center">
                                        <i className="bi bi-currency-dollar"></i> PREMIUM
                                    </div>
                                )}
                            </div>

                            <div className="card-body py-2">
                                <h5 className="card-title fw-bold">&nbsp; {tutorial.title}</h5>
                                <p className="card-text text-white">
                                &nbsp;&nbsp; {tutorial.desc.slice(0, 25)}...
                                </p>
                                &nbsp;&nbsp;
                                <Link to={`/Frontend_Tutorial_Solution/${tutorial.topicId}`} className="btn btn-outline-warning btn-sm rounded-pill" >
                                    View Code →
                                </Link>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Recent_Contents;
