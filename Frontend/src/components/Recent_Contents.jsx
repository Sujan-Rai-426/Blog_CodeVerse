import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Recent_Contents() {
    const [tutorials, setTutorials] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await api.get("/api/topics/");
                const topics = response.data;
                console.log("All topics from API:", topics);

                const frontendLanguageIds = [1, 11]; // frontend (HTML, JS, React)
                const backendLanguageIds = [2, 3, 4, 5]; // backend (Python, Django, etc.)

                // Collect all videos across all topics
                const allVideos = [];

                topics.forEach((topic) => {
                    if (topic.videos && topic.videos.length > 0) {
                        const isFrontend = frontendLanguageIds.includes(topic.language);
                        const type = isFrontend ? "frontend" : "backend";

                        topic.videos.forEach((video) => {
                            allVideos.push({
                                id: video.id, // unique per video
                                topicId: topic.id,
                                title: topic.name,
                                author: type.charAt(0).toUpperCase() + type.slice(1),
                                desc:
                                    video.info?.description ||
                                    "No description available",
                                video_url: video.video_url,
                                type,
                            });
                        });
                    }
                });

                // Sort by video ID (most recent first)
                const sortedVideos = allVideos.sort((a, b) => b.id - a.id);

                // Pick latest 3 videos
                const latestThree = sortedVideos.slice(0, 3);

                setTutorials(latestThree);
            } catch (error) {
                console.error("Error fetching tutorials:", error);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div className="row g-4">
            {tutorials.length === 0 ? (
                <p className="text-center text-muted py-5">
                    No recent tutorials found.
                </p>
            ) : (
                tutorials.map((tutorial) => (
                    <div className="col-12 col-md-6 col-lg-4" key={tutorial.id}>
                        <div className="card shadow-sm border-0 rounded-4 overflow-hidden tutorial-card">
                            {tutorial.video_url ? (
                                <video src={tutorial.video_url} autoPlay muted loop playsInline className="w-100" style={{ height: "200px", objectFit: "cover" }} />
                            ) : (
                                <img src="https://via.placeholder.com/400x200" className="card-img-top" alt={tutorial.title} style={{ height: "200px", objectFit: "cover" }} />
                            )}
                            <div className="card-body py-2">
                                <h5 className="card-title fw-bold">
                                    {/* &nbsp;&nbsp; = non breaking space */}
                                    &nbsp; {tutorial.title}
                                </h5>
                                {/* <p className="card-text text-muted small mb-1">
                                    {tutorial.author}
                                </p> */}
                                <p className="card-text">
                                    &nbsp;&nbsp; {tutorial.desc.slice(0, 25)}...
                                </p>
                                &nbsp;&nbsp;
                                <Link to={ `/Frontend_Tutorial_Solution/${tutorial.topicId}` } className="btn btn-outline-primary btn-sm rounded-pill" >
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
