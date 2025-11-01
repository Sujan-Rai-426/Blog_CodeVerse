import React, { useEffect, useState } from "react";
import "../assets/css/Home.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Carousel from "../components/Carousel";
import Recent_Contents from "../components/Recent_Contents";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

function Home() {
    const [frontendLangs, setFrontendLangs] = useState([]);
    const [backendLangs, setBackendLangs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get("/api/categories/");
                const data = res.data || [];

                const tutorialCategory = data.find(
                    (cat) => cat.name?.toLowerCase() === "tutorial"
                );
                if (tutorialCategory) {
                    const frontendSection = tutorialCategory.sections.find(
                        (section) => section.name?.toLowerCase() === "frontend"
                    );
                    const backendSection = tutorialCategory.sections.find(
                        (section) => section.name?.toLowerCase() === "backend"
                    );

                    setFrontendLangs(frontendSection?.languages || []);
                    setBackendLangs(backendSection?.languages || []);
                }
            } catch (err) {
                console.error("❌ Error fetching categories:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="home-container">

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        <b>Code</b><sup><u><small>Verse</small>💻</u></sup>
                    </h1>
                    <p className="hero-subtitle">
                        Your interactive coding platform — learn, share, and grow your skills in frontend, backend, and beyond.
                    </p>

                    <div className="social-bar d-flex justify-content-center align-items-center gap-4 mt-4">
                        <a href="https://www.sujan140.com.np" target="_blank" rel="noopener noreferrer" className="social-link globe" >
                            <i className="fas fa-globe"></i>
                        </a>
                        <a href="https://www.facebook.com/sujan.rai.1042" target="_blank" rel="noopener noreferrer" className="social-link facebook" >
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://www.instagram.com/sujan_rai_140/" target="_blank" rel="noopener noreferrer" className="social-link instagram" >
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://github.com/Sujan-Rai-426" target="_blank" rel="noopener noreferrer" className="social-link github" >
                            <i className="fab fa-github"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/sujan-rai-18a07b2a6/" target="_blank" rel="noopener noreferrer" className="social-link linkedin" >
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                    </div>

                    <button className="share-btn" 
                        onClick={() => {
                            const loggedIn = window.localStorage.getItem("loggedIn") === "true";
                            navigate(loggedIn ? "/Admin_Dashboard" : "/Admin_Login");
                        }}
                    >
                        ✍️ Share Your Code
                    </button>
                </div>
            </section>

            {/* Carousel Section */}
            <section className="carousel-section">
                {loading ? <Skeleton height={200} borderRadius={16} /> : <Carousel />}
            </section>

            {/* Frontend Section */}
            <section className="tutorial-section">
                <h6 className="section-title"> <small> 🎨 <sup><u>Frontend Designs</u></sup> </small> </h6>
                <div className="grid-container">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} className="grid-card">
                                <Skeleton circle height={40} width={40} style={{ marginBottom: 8 }} />
                                <Skeleton width={60} />
                            </div>
                        ))
                    ) : (
                        frontendLangs.map((lang) => (
                            <Link key={lang.id} to={`/Frontend_Tutorial_Topic/${lang.id}`} className="grid-card" >
                                {lang.icon_class && (
                                    <i className={`${lang.icon_class} card-icon`}></i>
                                )}
                                <span className="card-text">{lang.name}</span>
                            </Link>
                        ))
                    )}
                </div>
            </section>

            {/* Backend Section */}
            <section className="tutorial-section">
                <h6 className="section-title"> <small> 🖥️ <sup><u>Coding Guide</u></sup> </small> </h6>
                <div className="grid-container">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} className="grid-card">
                                <Skeleton circle height={40} width={40} style={{ marginBottom: 8 }} />
                                <Skeleton width={60} />
                            </div>
                        ))
                    ) : (
                        backendLangs.map((lang) => (
                            <Link key={lang.id} to={`/Backend_Tutorial_Topic/${lang.id}`} className="grid-card" >
                                {lang.icon_class && (
                                    <i className={`${lang.icon_class} card-icon`}></i>
                                )}
                                <span className="card-text">{lang.name}</span>
                            </Link>
                        ))
                    )}
                </div>
            </section>

            {/* Recent Blogs Section */}
            <section className="recent-section">
                <p className="section-title"> <small> 🕒 <sup><u>Recent Designs</u></sup> </small> </p>
                <div className="recent-wrapper">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, idx) => (
                            <Skeleton key={idx} height={120} borderRadius={12} style={{ marginBottom: '1rem' }} />
                        ))
                    ) : (
                        <Recent_Contents />
                    )}
                </div>
            </section>
        </div>
    );
}

export default Home;
