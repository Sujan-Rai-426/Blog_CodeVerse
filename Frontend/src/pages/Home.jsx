import React, { useEffect, useState } from "react";
import "../assets/css/Home.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Carousel from "../components/Carousel";
import Recent_Blogs from "../components/Recent_Blogs";

function Home() {
    const [frontendLangs, setFrontendLangs] = useState([]);
    const [backendLangs, setBackendLangs] = useState([]);
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
                        CodeVerse <span>💻</span>
                    </h1>
                    <p className="hero-subtitle">
                        Your interactive coding platform — learn, share, and grow your skills in frontend, backend, and beyond.
                    </p>
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

            {/* Carousel */}
            <section className="carousel-section">
                <Carousel />
            </section>

            {/* Frontend Section */}
            {frontendLangs.length > 0 && (
                <section className="tutorial-section">
                    <h6 className="section-title"> <small>- Frontend Tutorials -</small> </h6>
                    <div className="grid-container">
                        {frontendLangs.map((lang) => (
                            <Link key={lang.id} to={`/Frontend_Tutorial_Topic/${lang.id}`} className="grid-card" >
                                {lang.icon_class && (
                                    <i className={`${lang.icon_class} card-icon`}></i>
                                )}
                                <span className="card-text">{lang.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Backend Section */}
            {backendLangs.length > 0 && (
                <section className="tutorial-section">
                    <h6 className="section-title"> <small>- Backend Tutorials -</small> </h6>
                    <div className="grid-container">
                        {backendLangs.map((lang) => (
                            <Link key={lang.id} to={`/Backend_Tutorial_Topic/${lang.id}`} className="grid-card" >
                                {lang.icon_class && (
                                    <i className={`${lang.icon_class} card-icon`}></i>
                                )}
                                <span className="card-text">{lang.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

        {/* Recent Blogs */}
            <section className="recent-section">
                <h6 className="section-title"> <small>- Recent Tutorials -</small> </h6>
                <div className="recent-wrapper">
                    <Recent_Blogs />
                </div>
            </section>
        </div>
    );
}

export default Home;
