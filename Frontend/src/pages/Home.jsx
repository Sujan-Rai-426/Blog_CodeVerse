import React, { useEffect, useState, useContext } from "react";
import "../assets/css/Home.css";
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


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


        {/* =============== Hero Section =============== */}
            <section className="hero mb-5">
                <div className="hero-content">
                    
                    {/* Hero description */}
                    <div className="hero-subtitle text-center">
                        <h2 className="hero-title">
                            Where Ideas Turn Into Code and Where Coding Meets Creativity.
                        </h2>
                        <p className="hero-note m-0">
                            <small> - Follow our social media to stay updated - </small>
                        </p>
                        <p className="hero-warning m-0">
                            📢 <small>More Content Will Be Added on a Weekly Basis...</small>
                        </p>
                    </div>

                        {/* Hero Social Media Links */}
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

                    {/* Hero Card Highlights */}
                    <div className="hero-card-highlights">
                        <div className="highlight-card text-light">
                            <i className="bi bi-lightning-fill highlight-icon"></i>
                            <h5>Fast & Modern</h5>
                            <p>All tutorials are easy to use and easy to modify.</p>
                        </div>
                        <div className="highlight-card text-light">
                            <i className="bi bi-star-fill highlight-icon"></i>
                            <h5>Premium Quality</h5>
                            <p>Curated high-quality content for developers.</p>
                        </div>
                        <div className="highlight-card text-light">
                            <i className="bi bi-globe highlight-icon"></i>
                            <h5>Global Access</h5>
                            <p>Access your tutorials from anywhere, anytime.</p>
                        </div>
                    </div>

                        {/* Hero  BTN Section */}
                    <div style={{ display: 'flex', flexDirection:'row', justifyContent:'space-between' }}>
                            {/* PlayGround BTN */}
                            <button
                                className="share-btn text-light"
                                onClick={() => {
                                    navigate( "/PlayGround");
                                }}
                            >
                                <i className="bi bi-joystick fs-5 "></i> PlayGround
                            </button>

                            {/* Share code BTN */}
                            <button
                                className="share-btn text-light"
                                onClick={() => {
                                    const loggedIn = window.localStorage.getItem("loggedIn") === "true";
                                    navigate(loggedIn ? "/Admin_Dashboard" : "/Admin_Login");
                                }}
                            >
                                <i className="bi bi-share"></i> Share Code
                            </button>
                    </div>
                    
                </div>
            </section>


        {/* =============== Service Section =============== */}
            <section className="service mt-2 mb-5">
                <h2 className="home-section-title">Our Top Services</h2>
                <p className="section-subtext">
                    Explore our essential services designed to help developers build faster and smarter.
                </p>
                <Services />
            </section>


        {/* =============== Frontend Section =============== */}
            <section id="FRONTEND_TUTORIALS" className="tutorial-section">
                <h2 className="home-section-title">Frontend Components Design</h2>
                <p className="section-subtext">
                    Discover modern, reusable UI components to enhance your frontend development workflow.
                </p>

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


        {/* =============== Backend Section =============== */}
            <section id="CODING_GUIDE" className="tutorial-section">
                <h2 className="home-section-title">Coding Guide</h2>
                <p className="section-subtext">
                    Improve your development workflow with hands-on guides for Frontend, backend coding, and API development.
                </p>

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


        {/* =============== Recent Blogs Section =============== */}
            <section className="recent-section mt-3">
                <h2 className="home-section-title">Recently uploaded Designs</h2>
                <p className="section-subtext">
                    Browse our latest uploaded UI designs, components, and creative inspirations.
                </p>

                <div>
                    <Recent_Contents />
                </div>
            </section>


        {/* =============== Informational Content Section =============== */}
            <section className="info-section">
                <div className="info-container">
                    <h2 className="home-section-title">Quality Resources for Developers & Designers</h2>

                    <p className="info-text">
                        At Codevora, we focus on delivering high–quality and practical resources 
                        for developers, designers, and digital creators. Our platform publishes clean,
                        well-structured UI components, modern layouts, and reusable design elements
                        that help you build stunning web applications with ease.
                    </p>

                    <p className="info-text">
                        Every design and code snippet shared on Codevora is carefully crafted to meet 
                        professional standards, ensuring responsiveness, accessibility, and performance. 
                        We aim to support both beginners and experienced developers by providing content 
                        that is easy to understand, implement, and customize.
                    </p>

                    <p className="info-text">
                        Our team consistently works on expanding the collection with fresh designs, 
                        updated tutorials, and detailed guides. We believe in empowering creators 
                        with knowledge and inspiration, helping them bring their ideas to life through 
                        clean code and thoughtful UI/UX practices.
                    </p>

                    <p className="info-text">
                        Stay connected with us as we continue to improve, learn, and deliver meaningful 
                        resources that elevate your development journey.
                    </p>
                </div>
            </section>

        </div>
    );
}

export default Home;
