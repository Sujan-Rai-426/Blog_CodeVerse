// src/components/Components_Design.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../assets/css/Nav_Bar.css";

// ------------------- NAVIGATION BAR COMPONENT -------------------
function Nav_Bar() {

  // ------------------- STATE -------------------
    const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar
    const [aboutOpen, setAboutOpen] = useState(false); // desktop dropdown
    const [aboutMobileOpen, setAboutMobileOpen] = useState(false); // mobile dropdown
    const [isTouchDevice, setIsTouchDevice] = useState(false); // detect touch

    const aboutRef = useRef(null);
    const sidebarRef = useRef(null);

  // ------------------- EFFECT: Detect touch devices -------------------
    useEffect(() => {
        const checkTouch = () => {
            const coarse = window.matchMedia("(pointer: coarse)").matches;
            const uaTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
            setIsTouchDevice(coarse || uaTouch);
        };
        checkTouch();
        window.addEventListener("resize", checkTouch);
        return () => window.removeEventListener("resize", checkTouch);
    }, []);

  // ------------------- EFFECT: Close About dropdown on click outside -------------------
    useEffect(() => {
        function onDocClick(e) {
            if (aboutRef.current && !aboutRef.current.contains(e.target)) {
                setAboutOpen(false);
            }
        }
        document.addEventListener("click", onDocClick);
        return () => document.removeEventListener("click", onDocClick);
    }, []);

  // ------------------- EFFECT: Close Sidebar on click outside -------------------
    useEffect(() => {
        function onDocClick(e) {
            if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                setSidebarOpen(false);
            }
        }
        document.addEventListener("click", onDocClick);
        return () => document.removeEventListener("click", onDocClick);
    }, [sidebarOpen]);

  // ------------------- HANDLERS -------------------
    const toggleSidebar = (e) => {
        e.stopPropagation();
        setSidebarOpen((s) => !s);
    };

    const handleAboutMouseEnter = () => {
        if (!isTouchDevice && window.innerWidth >= 768) setAboutOpen(true);
    };
    const handleAboutMouseLeave = () => {
        if (!isTouchDevice && window.innerWidth >= 768) setAboutOpen(false);
    };
    const handleAboutClick = (e) => {
        e.preventDefault();
        if (isTouchDevice || window.innerWidth < 768) {
            setAboutOpen((s) => !s);
        }
    };

    const toggleAboutMobile = () => setAboutMobileOpen((s) => !s);

    const scrollToSection = (id) => {
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                const offset = -100;
                const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: elementPosition + offset, behavior: "smooth" });
            }
        }, 120);
    };

  // ------------------- JSX RENDER -------------------
    return (
        <>
        {/* ===================== Desktop Navbar ===================== */}
            <nav className="navbar-custom nb-navbar-standard sticky-top" role="navigation">
                <div className="nav-container">
                    <Link to="/Admin/Login" className="brand">
                        <b>Code</b>
                        <sup>
                            <u>
                                <small>Vora</small>💻
                            </u>
                        </sup>
                    </Link>

                    {/* Right actions: profile + menu */}
                    <div className="nav-right">
                        {/* Profile Button */}
                        {/* <Link to={"/User/Profile"} > 
                            <i className="bi bi-person-circle text-light mx-3 fs-2 hover:text-gray"></i> 
                        </Link> */}

                        {/* Mobile hamburger */}
                        <button className="nb-hamburger d-lg-none" onClick={toggleSidebar} aria-label="Open menu">
                            ☰
                        </button>

                        {/* Desktop nav */}
                        <ul className="nb-nav-list d-none d-lg-flex">
                            <li className="nb-nav-item">
                                <Link to="/" className="nb-nav-link">Home</Link>
                            </li>

                            {/* About dropdown */}
                            <li
                                className={`nb-nav-item nb-nav-dropdown ${aboutOpen ? "open" : ""}`}
                                ref={aboutRef}
                                onMouseEnter={handleAboutMouseEnter}
                                onMouseLeave={handleAboutMouseLeave}
                            >
                                <Link to="#about" className="nb-nav-link dropdown-toggle" onClick={handleAboutClick} aria-expanded={aboutOpen}>
                                    More <span className={`nb-caret ${aboutOpen ? "open" : ""}`}>▾</span>
                                </Link>
                                <div className={`nb-dropdown-panel ${aboutOpen ? "visible" : ""}`}>
                                    <a className="nb-dropdown-item" href="https://escape-road-140.netlify.app/">
                                        <i className="bi bi-controller"></i> &nbsp; Game
                                    </a>
                                    <a className="nb-dropdown-item" href="https://sujan140.vercel.app">
                                        <i className="bi bi-person-fill"></i> &nbsp; Developer
                                    </a>
                                    <Link className="nb-dropdown-item" to="/About">
                                        <i className="bi bi-people-fill"></i> &nbsp; Our Team
                                    </Link>
                                    <Link className="nb-dropdown-item" to="/Privacy_Policy">
                                        <i className="bi bi-shield-lock-fill"></i> &nbsp; Privacy Policy
                                    </Link>
                                </div>
                            </li>

                            <li className="nb-nav-item">
                                <Link to="/Templates/Topics" className="nb-nav-link" onClick={() => scrollToSection('TEMPLATES')}>Templates</Link>
                            </li>
                            <li className="nb-nav-item">
                                <Link to={`/Components/Topics/1`} className="nb-nav-link">Components</Link>
                            </li>
                            <li className="nb-nav-item">
                                <Link to={`/Code-Guide/Topic/2`} className="nb-nav-link">Coding-Guides</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        {/* ===================== Mobile Sidebar ===================== */}
            <aside className={`nb-sidebar ${sidebarOpen ? "open" : ""}`} ref={sidebarRef} role="dialog" aria-modal="true">
                <button className="nb-sidebar-close" onClick={toggleSidebar} aria-label="Close menu">×</button>

                <ul className="nb-sidebar-list">
                    {/* Profile icon Link */}
                    <li>
                        <Link to="/User/Profile" onClick={() => setSidebarOpen(false)}>
                            <i className="bi bi-person-fill-gear"></i> &nbsp; My Profile
                        </Link>
                    </li>
                    <li><hr className="sidebar-divider" /></li>

                    <li>
                        <Link to="/" onClick={() => setSidebarOpen(false)}>
                            <i className="bi bi-house-fill"></i> &nbsp; Home
                        </Link>
                    </li>

                    {/* Mobile About dropdown */}
                    <li>
                        <button className="nb-sidebar-dropdown-btn" onClick={toggleAboutMobile} aria-expanded={aboutMobileOpen}>
                            <i className="bi bi-file-earmark-person-fill"></i> &nbsp; More <span className={`fs-4 nb-caret ${aboutMobileOpen ? "open" : ""}`}>▾</span>
                        </button>
                        <ul className={`nb-sidebar-sublist ${aboutMobileOpen ? "open" : ""}`}>
                            <li> 
                                <a href="https://escape-road-140.netlify.app/" onClick={() => setSidebarOpen(false)}><i className="bi bi-controller"></i> &nbsp; Game</a>
                            </li>
                            <li> 
                                <a href="https://sujan140.vercel.app" onClick={() => setSidebarOpen(false)}><i className="bi bi-person-fill"></i> &nbsp; Developer</a>
                            </li>
                            <li>
                                <Link to="/About" onClick={() => setSidebarOpen(false)}><i className="bi bi-people-fill"></i> &nbsp; Our Team</Link>
                            </li>
                            <li>
                                <Link to="/Privacy_Policy" onClick={() => setSidebarOpen(false)}><i className="bi bi-shield-lock-fill"></i> &nbsp; Privacy Policy</Link>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <Link to="/Templates/Topics" onClick={() => scrollToSection('TEMPLATE')}>
                            <i className="bi bi-columns"></i> &nbsp; Templates
                        </Link>
                    </li>
                    <li>
                        <Link to="/Components/Topics/1">
                            <i className="bi bi-easel3"></i> &nbsp; Components
                        </Link>
                    </li>
                    <li>
                        <Link to="/Code-Guide/Topic/2">
                            <i className="bi bi-journal-code"></i> &nbsp; Coding-Guides
                        </Link>
                    </li>
                    <li>
                        <Link to="/Contact" onClick={() => setSidebarOpen(false)}>
                            <i className="bi bi-chat-text-fill"></i> &nbsp; Contact Us
                        </Link>
                    </li>
                </ul>
            </aside>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && <div className="nb-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        </>
    );
}

export default Nav_Bar;
