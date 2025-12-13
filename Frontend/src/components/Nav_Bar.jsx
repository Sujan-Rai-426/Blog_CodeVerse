// src/components/Components_Design.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../assets/css/Nav_Bar.css";
import { PersonCircle } from "react-bootstrap-icons"; // icon fallback
import apiClient from "../config/apiClient"; // your Axios client with refresh handling


// ------------------- NAVIGATION BAR COMPONENT -------------------
function Nav_Bar() {
  // ------------------- STATE -------------------
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar
  const [aboutOpen, setAboutOpen] = useState(false); // desktop dropdown
  const [aboutMobileOpen, setAboutMobileOpen] = useState(false); // mobile dropdown
  const [isTouchDevice, setIsTouchDevice] = useState(false); // detect touch
  const [isLoggedIn, setIsLoggedIn] = useState(false); // user login state
  const [user, setUser] = useState(null); // user profile data

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
    if (!isTouchDevice && window.innerWidth >= 992) setAboutOpen(true);
  };
  const handleAboutMouseLeave = () => {
    if (!isTouchDevice && window.innerWidth >= 992) setAboutOpen(false);
  };
  const handleAboutClick = (e) => {
    e.preventDefault();
    if (isTouchDevice || window.innerWidth < 992) {
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
        <nav className="navbar-custom navbar-standard sticky-top" role="navigation">
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
                    <Link to={"/User/Profile"} > <i className="bi bi-person-circle text-light mx-3 fs-2 hover:text-gray"></i> </Link>

                    {/* Mobile hamburger */}
                    <button className="hamburger d-lg-none" onClick={toggleSidebar} aria-label="Open menu">
                      ☰
                    </button>

                    {/* ============================ ================================*/}
                    {/* =================Desktop nav ================================*/}
                    {/* ================================ ================================*/}
                    <ul className="nav-list d-none d-lg-flex">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>

                        {/* About dropdown */}
                        <li
                            className={`nav-item nav-dropdown ${aboutOpen ? "open" : ""}`}
                            ref={aboutRef}
                            onMouseEnter={handleAboutMouseEnter}
                            onMouseLeave={handleAboutMouseLeave}
                        >
                            <Link to="#about" className="nav-link dropdown-toggle" onClick={handleAboutClick} aria-expanded={aboutOpen}>
                                More <span className={`caret ${aboutOpen ? "open" : ""}`}>▾</span>
                            </Link>
                            <div className={`dropdown-panel ${aboutOpen ? "visible" : ""}`}>
                                  <a className="dropdown-item" href="https://escape-road-140.netlify.app/">
                                      <i className="bi bi-controller"></i> Game
                                  </a>
                                  <a className="dropdown-item" href="https://sujan140.vercel.app">
                                      <i className="bi bi-person-fill"></i> Developer
                                  </a>
                                  <Link className="dropdown-item" to="/About">
                                    <i className="bi bi-people-fill"></i> Our Team
                                  </Link>
                                  <Link className="dropdown-item" to="/Privacy_Policy">
                                      <i className="bi bi-shield-lock-fill"></i> Privacy Policy
                                  </Link>
                            </div>
                        </li>

                        <li className="nav-item">
                            <Link to="/Templates" className="nav-link" onClick={() => scrollToSection('TEMPLATES')}>Templates</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/" className="nav-link" onClick={() => scrollToSection('FRONTEND_TUTORIALS')}>Components</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/" className="nav-link" onClick={() => scrollToSection('CODING_GUIDE')}>Coding-Guides</Link>
                        </li>
                        {/* <li className="nav-item">
                            <Link to="/PlayGround" className="nav-link">PlayGround</Link>
                        </li> */}
                    </ul>
                </div>
            </div>
        </nav>



      {/* ===================== ============== ===================== */}
      {/* ===================== Mobile Sidebar ===================== */}
      {/* ===================== ============== ===================== */}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} ref={sidebarRef} role="dialog" aria-modal="true">
            <button className="sidebar-close" onClick={toggleSidebar} aria-label="Close menu">×</button>

            <ul className="sidebar-list">
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
                    <button className="sidebar-dropdown-btn" onClick={toggleAboutMobile} aria-expanded={aboutMobileOpen}>
                        <i className="bi bi-file-earmark-person-fill"></i> &nbsp; More <span className={`fs-4 caret ${aboutMobileOpen ? "open" : ""}`}>▾</span>
                    </button>
                    <ul className={`sidebar-sublist ${aboutMobileOpen ? "open" : ""}`}>
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
                    <Link to="/Templates" onClick={() => scrollToSection('TEMPLATE')}>
                        <i className="bi bi-columns"></i> &nbsp; Templates
                    </Link>
                </li>
                <li>
                    <Link to="/" onClick={() => scrollToSection('FRONTEND_TUTORIALS')}>
                        <i className="bi bi-easel3"></i> &nbsp; Components
                    </Link>
                </li>
                <li>
                    <Link to="/" onClick={() => scrollToSection('CODING_GUIDE')}>
                        <i className="bi bi-journal-code"></i> &nbsp; Coding-Guides
                    </Link>
                </li>
                <li>
                    <Link to="/Contact" onClick={() => setSidebarOpen(false)}>
                        <i className="bi bi-chat-text-fill"></i> &nbsp; Contact Us
                    </Link>
                </li>
                {/* <li>
                    <Link to="/PlayGround" onClick={() => setSidebarOpen(false)}>
                        <i className="bi bi-joystick"></i> &nbsp; PlayGround
                    </Link>
                </li> */}
            </ul>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </>
  );
}

export default Nav_Bar;
