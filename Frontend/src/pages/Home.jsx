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
        <div className="home-wrapper container py-5">
            {/* Hero Section */}
            <section className="hero text-center mb-5">
                <div className="hero-glass p-5 rounded-4 shadow-sm">
                    <h1 className="fw-bold display-5 mb-3 gradient-text">
                        Welcome to <span className="fw-bolder">CodeVerse 💻</span>
                    </h1>
                    <p className="lead text-secondary mx-auto" style={{ maxWidth: "700px" }}>
                        Explore, learn, and share code tutorials crafted by passionate developers.
                        Your journey into frontend, backend, and full-stack development starts here.
                    </p>

                    <div className="social-bar d-flex justify-content-center align-items-center gap-4 mt-4">

                        {/* Website Globe Logo */}
                        <a href="https://www.sujan140.com.np" target="_blank" rel="noopener noreferrer" className="social-link globe" >
                            <i className="fas fa-globe"></i>
                        </a>

                        {/* Facebook */}
                        <a href="https://www.facebook.com/sujan.rai.1042" target="_blank" rel="noopener noreferrer" className="social-link facebook" >
                            <i className="fab fa-facebook-f"></i>
                        </a>

                        {/* Instagram */}
                        <a href="https://www.instagram.com/sujan_rai_140/" target="_blank" rel="noopener noreferrer" className="social-link instagram" >
                            <i className="fab fa-instagram"></i>
                        </a>

                        {/* GitHub */}
                        <a href="https://github.com/Sujan-Rai-426" target="_blank" rel="noopener noreferrer" className="social-link github" >
                            <i className="fab fa-github"></i>
                        </a>

                        {/* LinkedIn */}
                        <a href="https://www.linkedin.com/in/sujan-rai-18a07b2a6/" target="_blank" rel="noopener noreferrer" className="social-link linkedin" >
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                    </div>

                    <button className="btn explore-btn mt-4 px-5 py-2"
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
            <section className="mb-5">
                <Carousel />
            </section>


            {/* Frontend Section */}
            {frontendLangs.length > 0 && (
                <section className="mb-5">
                    <h2 className="section-heading text-center mb-4">Frontend Tutorials</h2>
                    <div className="row g-4 justify-content-center">
                        {frontendLangs.map((lang) => (
                            <div key={lang.id} className="col-6 col-md-4 col-lg-3 text-center">
                                <Link to={`/Frontend_Tutorial_Topic/${lang.id}`} className="text-decoration-none" style={{ color: "inherit" }} >
                                    <div className="d-flex flex-column align-items-center">
                                        {/* Icon inside circle with hover effect */}
                                        {lang.icon_class && (
                                            <div className="circle-hover">
                                                <i className={lang.icon_class} style={{ fontSize: "3.2rem" }} ></i>
                                            </div>
                                        )}
                                        <h5 className="fw-semibold mb-0 text-capitalize mt-2">
                                            {lang.name}
                                        </h5>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Backend Section */}
            {backendLangs.length > 0 && (
                <section className="mb-5">
                    <h2 className="section-heading text-center mb-4">Backend Tutorials</h2>
                    <div className="row g-4 justify-content-center">
                        {backendLangs.map((lang) => (
                            <div key={lang.id} className="col-6 col-md-4 col-lg-3 text-center">
                                <Link to={`/Backend_Tutorial_Topic/${lang.id}`} className="text-decoration-none" style={{ color: "inherit" }} >
                                    <div className="d-flex flex-column align-items-center">
                                        {/* Icon inside circle with hover effect */}
                                        {lang.icon_class && (
                                            <div className="circle-hover">
                                                <i className={lang.icon_class} style={{ fontSize: "3.2rem" }} ></i>
                                            </div>
                                        )}
                                        <h5 className="fw-semibold mb-0 text-capitalize mt-2">
                                            {lang.name}
                                        </h5>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}



            {/* Recent Blogs */}
            <section>
                <h2 className="section-heading text-center mb-4">
                    Recent Responsive Designs
                </h2>
                <Recent_Blogs />
            </section>
        </div>
    );
}

export default Home;
