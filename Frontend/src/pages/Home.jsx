import React, { useEffect, useState, useContext } from "react";
import "../assets/css/Home.css";
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import Recent_Contents from "../components/Recent_Contents";
import Services from "../components/Services";

import { Parent_API_Provider_Context } from "../context/Parent_API_Provider.jsx";
import Interactive_Grid_Background from "../context/Interactive_Grid_Background.jsx";

function Home() {
    const { languages, loadingBase: parentLoading } = useContext(Parent_API_Provider_Context);

    // Split languages by section: 1 = frontend, 2 = backend
    const frontendLangs = (languages || []).filter(l => l.section === 1);
    const backendLangs = (languages || []).filter(l => l.section === 2);

    const [showLoadingMessage, setShowLoadingMessage] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (parentLoading) setShowLoadingMessage(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, [parentLoading]);


    const [selectValue, setSelectValue] = useState(""); // Initialize state

    const handleSelectPlayground = (e) => {
        const path = e.target.value;
        if (path) {
            navigate(path);
            setSelectValue(""); 
        }
    };


    return (
        <div className="home-container" style={{ minHeight: "100vh", padding:'0 1rem !important' }}>
            {showLoadingMessage && parentLoading && languages.length === 0 &&  (
                <div className="loading-overlay">
                    <div className="loading-message text-info">
                        <h2>Good things take time</h2>
                        <p>Almost there! Hold tight! Loading the magic ✨...</p>
                    </div>
                </div>
            )}

<Interactive_Grid_Background>
            {/* Hero Section */}
            <section className="hero mb-5">
                <div className="hero-content">
                    <div className="hero-subtitle text-center">
                        <h1 className="tt-header-stats mb-3 mt-0"><b>CodeVora UI</b></h1>
                        <h2 className="hero-title">
                            Free Open-Source UI Components, <br /> 
                            Templates, Programming snippets & Guides <br />
                            All in one place.
                        </h2>
                        <p className="hero-note text-light m-0">
                        </p>
                    </div>

                    {/* Hero Social Media Links */}
                    <div className="social-bar d-flex justify-content-center align-items-center gap-4 mt-3">
                        <a href="https://www.youtube.com/@CodeVora140" className="social-link globe" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-youtube"></i>
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61583606692743" className="social-link facebook" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://www.instagram.com/codevora140/" className="social-link instagram" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://github.com/Sujan-Rai-426" className="social-link github" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-github"></i>
                        </a>
                        <a href="https://www.linkedin.com/company/109567566/admin/page-posts/published/" className="social-link linkedin" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                    </div>

                    {/* Hero Card Highlights */}
                    <div className="hero-card-highlights">
                        <div className="highlight-card text-light">
                            <i className="bi bi-lightning-fill highlight-icon text-primary"></i>
                            <h5>Fast & Modern</h5>
                            <small>All tutorials are easy to use and easy to modify.</small>
                        </div>
                        <div className="highlight-card text-light">
                            <i className="bi bi-star-fill highlight-icon"></i>
                            <h5>Premium Quality</h5>
                            <small>Curated high-quality content for developers.</small>
                        </div>
                        <div className="highlight-card text-light">
                            <i className="bi bi-globe highlight-icon text-success"></i>
                            <h5>Global Access</h5>
                            <small>Access your tutorials from anywhere, anytime.</small>
                        </div>
                    </div>

                    {/* Hero Buttons */}
                    <div style={{ display: 'flex', flexDirection:'row', justifyContent:'space-between' }}>

                        {/* ******* PLAYGROUND SELECT BAR *********** */}
                        <select 
                            className="share-btn text-light" 
                            onChange={handleSelectPlayground}
                            value={selectValue}
                        >
                            <option value="" disabled> Select PlayGround</option>
                            <option value="PlayGround/Code-Compiler" className="nav-option">
                                Code Compiler
                            </option>
                            <option value="PlayGround/Code-Generator" className="nav-option">
                                Code Generator
                            </option>
                        </select>

                        <button
                            className="share-btn text-light"
                            onClick={() => {
                                const loggedIn = window.localStorage.getItem("loggedIn") === "true";
                                navigate(loggedIn ? "/User/Profile" : "/User/Login");
                            }}
                        >
                            <i className="bi bi-box-arrow-in-right"></i> SignIn / SignUp
                        </button>
                    </div>
                </div>
            </section>
</Interactive_Grid_Background>
            
            {/* Services Section */}
            <section className="service mt-2 mb-5">
                <h2 className="home-section-title">Our Top Services</h2>
                <p className="section-subtext">
                    Explore our essential services designed to help developers build faster and smarter.
                </p>
                <Services />
            </section>

            {/* Frontend Languages Section */}
            <section id="FRONTEND_TUTORIALS" className="tutorial-section">
                <h2 className="home-section-title">Frontend Components Design</h2>
                <p className="section-subtext">
                    Discover modern, reusable UI components to enhance your frontend development workflow.
                </p>

                <div className="grid-container">
                    {parentLoading && !languages.length 
                        ? Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} className="grid-card">
                                <Skeleton height={40} width={40} style={{ marginBottom: 8, borderRadius: "10px" }} />
                                <Skeleton width={60} baseColor="#2b2b2b" highlightColor="#3b3b3b" />
                            </div>
                        ))
                        : frontendLangs.map((lang) => (
                            <Link key={lang.id} to={`/Components/Topics/${lang.id}`} className="grid-card">
                                {lang.icon_class && <i className={`${lang.icon_class} card-icon`}></i>}
                                <span className="card-text">{lang.name}</span>
                            </Link>
                        ))}
                </div>
            </section>

            {/* Backend Languages Section */}
            <section id="CODING_GUIDE" className="tutorial-section">
                <h2 className="home-section-title">Coding Guide</h2>
                <p className="section-subtext">
                    Improve your development workflow with hands-on guides for Frontend, backend coding, and API development.
                </p>

                <div className="grid-container">
                    {parentLoading && !languages.length 
                        ? Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} className="grid-card">
                                <Skeleton height={40} width={40} style={{ marginBottom: 8, borderRadius: "10px" }} />
                                <Skeleton width={60} baseColor="#2b2b2b" highlightColor="#3b3b3b" />
                            </div>
                        ))
                        : backendLangs.map((lang) => (
                            <Link key={lang.id} to={`/Code-Guide/Topic/${lang.id}`} className="grid-card">
                                {lang.icon_class && <i className={`${lang.icon_class} card-icon`}></i>}
                                <span className="card-text">{lang.name}</span>
                            </Link>
                        ))}
                </div>
            </section>

            {/* Templates Section */}
            <section className="templates-section mt-3">
                <div className="templates-header">
                    <h2 className="home-section-title">Explore Our Templates</h2>
                    <p className="section-subtext">
                        Our curated collection of templates is designed to accelerate your workflow. 
                        Clean, modern, and responsive—perfect for React, Django, or plain HTML/CSS projects.
                    </p>
                </div>

                <div className="templates-preview-description">
                    <p> Quick highlights of what you'll get: </p>
                    <ul>
                        <li>Professionally designed UI layouts.</li>
                        <li>Responsive design for mobile, tablet, and desktop.</li>
                        <li>Reusable components ready to integrate into your projects.</li>
                        <li>Free and premium options to suit your needs.</li>
                    </ul>
                </div>

                <div className="templates-cta">
                    <button  
                        className="btn-primary"      
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/Templates/Topics");
                            setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
                        }}
                    >
                        <i className="bi bi-columns"></i> Templates
                    </button>
                </div>
            </section>

            {/* Recent Components Section */}
            <section className="recent-section mt-3 mx-2">
                <h2 className="home-section-title">Recently uploaded Designs</h2>
                <p className="section-subtext">
                    Browse our latest uploaded UI designs, components, and creative inspirations.
                </p>

                <Recent_Contents />
            </section>

            {/* Info Section */}
            <section className="info-section">
                <div className="info-container">
                    <h2 className="home-section-title">Quality Resources for Developers & Designers</h2>
                    <p className="info-text">
                        At Codevora, we focus on delivering high–quality and practical resources 
                        for developers, designers, and digital creators...
                    </p>
                </div>
            </section>
        </div>
    );
}

export default Home;
