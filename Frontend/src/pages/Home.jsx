import React, { useEffect, useState, useContext } from "react";
import "../assets/css/Home.css";
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import Carousel from "../components/Carousel";
import Recent_Contents from "../components/Recent_Contents";
import Services from "../components/Services";

import { Parent_API_Provider_Context } from "../context/Parent_API_Provider.jsx";

function Home() {
    const { data, loading: parentLoading, error } = useContext(Parent_API_Provider_Context);

    const [frontendLangs, setFrontendLangs] = useState([]);
    const [backendLangs, setBackendLangs] = useState([]);
    const [showLoadingMessage, setShowLoadingMessage] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (parentLoading) setShowLoadingMessage(true);
        }, 3000);

        if (!parentLoading && data) {
            const categories = Array.isArray(data) ? data : [];
            const tutorialCategory = categories.find(
                (cat) => cat.name?.toLowerCase() === "tutorial"
            );

            if (tutorialCategory) {
                const frontendSection = tutorialCategory.sections?.find(
                    (section) => section.name?.toLowerCase() === "frontend"
                );
                const backendSection = tutorialCategory.sections?.find(
                    (section) => section.name?.toLowerCase() === "backend"
                );

                setFrontendLangs(frontendSection?.languages || []);
                setBackendLangs(backendSection?.languages || []);
            }
        }

        return () => clearTimeout(timer);
    }, [parentLoading, data]);

    return (
        <div className="home-container">
            {/* Loading Message Overlay if loading > 3s */}
            {showLoadingMessage && parentLoading && (
                <div className="loading-overlay">
                    <div className="loading-message">
                        <h2>Good things take time</h2>
                        <p>Almost there! Hold tight! Loading the magic ✨...</p>
                    </div>
                </div>
            )}

        {/* Hero Section */}
            <section className="hero mb-5">
                <div className="hero-content">
                    <h1 className="hero-title text-golden">
                        <b>Code</b>
                        <sup>
                            <u>
                                <small>Vora</small>💻
                            </u>
                        </sup>
                    </h1>
                    <h5 className="hero-subtitle text-gray">
                        Where Ideas Turn Into Code and Where Coding Meets Creativity.
                        <p className="text-warning m-0 p-0">
                            📢{" "}
                            <small>
                                More Content Will Be Added on Weekly Basis...
                            </small>
                        </p>
                    </h5>

                    <div className="social-bar d-flex justify-content-center align-items-center gap-4 mt-3">
                        <a href="https://www.youtube.com/@CodeVora140" className="social-link globe" target="_blank" rel="noopener noreferrer" >
                            <i className="fab fa-youtube"></i>
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61583606692743" className="social-link facebook" target="_blank" rel="noopener noreferrer" >
                            <i className=" fab fa-facebook-f"></i>
                        </a>
                        <a href="https://www.instagram.com/codevora140/" className="social-link instagram" target="_blank" rel="noopener noreferrer" >
                            <i className=" fab fa-instagram"></i>
                        </a>
                        <a href="https://github.com/Sujan-Rai-426" className="social-link github" target="_blank" rel="noopener noreferrer" >
                            <i className=" fab fa-github"></i>
                        </a>
                        <a href="https://www.linkedin.com/company/109567566/admin/page-posts/published/" className="social-link linkedin" target="_blank" rel="noopener noreferrer" >
                            <i className=" fab fa-linkedin-in"></i>
                        </a>
                    </div>
                        {/* Hero  BTN Section */}
                    <div style={{ display: 'flex', flexDirection:'row', justifyContent:'space-between' }}>
                            {/* PlayGround BTN */}
                            <button
                                className="share-btn"
                                onClick={() => {
                                    navigate( "/PlayGround");
                                }}
                            >
                                🎮 PlayGround
                            </button>

                            {/* Share code BTN */}
                            <button
                                className="share-btn"
                                onClick={() => {
                                    const loggedIn = window.localStorage.getItem("loggedIn") === "true";
                                    navigate(loggedIn ? "/Admin_Dashboard" : "/Admin_Login");
                                }}
                            >
                                ✍️ Share Code
                            </button>
                    </div>
                </div>
            </section>

        {/* Service Section */}
            <section className="service mt-2 mb-5">
                <Services />
            </section>

        {/* Frontend Section */}
            <section className="tutorial-section mt-2 mb-5">
                <h6 className="section-title">
                    <small>
                        {" "}
                        🎨 <sup>
                            <u>Fronted Components Design</u>
                        </sup>{" "}
                    </small>
                </h6>
                <div className="grid-container">
                    {parentLoading
                        ? Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} className="grid-card">
                                <Skeleton
                                    height={40}
                                    width={40}
                                    style={{ marginBottom: 8, borderRadius: "10px" }}
                                    baseColor="#2b2b2b"
                                    highlightColor="#3b3b3b"
                                />
                                <Skeleton width={60} baseColor="#2b2b2b" highlightColor="#3b3b3b" />
                            </div>
                        ))
                        : frontendLangs.map((lang) => (
                            <Link
                                key={lang.id}
                                to={`/Frontend_Tutorial_Topic/${lang.id}`}
                                className="grid-card"
                            >
                                {lang.icon_class && <i className={`${lang.icon_class} card-icon`}></i>}
                                <span className="card-text">{lang.name}</span>
                            </Link>
                        ))}
                </div>
            </section>

        {/* Backend Section */}
            <section className="tutorial-section mt-3  mb-5">
                <h6 className="section-title">
                    <small>
                        {" "}
                        🖥️ <sup>
                            <u>Coding Guide</u>
                        </sup>{" "}
                    </small>
                </h6>
                <div className="grid-container">
                    {parentLoading
                        ? Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} className="grid-card">
                                <Skeleton
                                    height={40}
                                    width={40}
                                    style={{ marginBottom: 8, borderRadius: "10px" }}
                                    baseColor="#2b2b2b"
                                    highlightColor="#3b3b3b"
                                />
                                <Skeleton width={60} baseColor="#2b2b2b" highlightColor="#3b3b3b" />
                            </div>
                            ))
                        : backendLangs.map((lang) => (
                        <Link
                            key={lang.id}
                            to={`/Backend_Tutorial_Topic/${lang.id}`}
                            className="grid-card"
                        >
                            {lang.icon_class && <i className={`${lang.icon_class} card-icon`}></i>}
                            <span className="card-text">{lang.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Recent Blogs Section */}
            <section className="recent-section mt-3">
                <p className="section-title">
                    <small>
                        {" "}
                        🕒 <sup>
                            <u>Recently uploaded Designs</u>
                        </sup>{" "}
                    </small>
                </p>
                <div className="recent-wrapper">
                    <Recent_Contents />
                </div>
            </section>
        </div>
    );
}

export default Home;
