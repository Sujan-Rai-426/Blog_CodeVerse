// src/components/Components_Design.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/Nav_Bar.css";
import { FaPlay, FaSignInAlt, FaUser, FaUserPlus } from "react-icons/fa";
import User_API_Context from "../clients/User_API_Context";
import CodeVora_Logo from "../assets/img/About_img/CodeVora.png"

// Dynamic Avatar URL Change
const AVATAR_BASE_URL = import.meta.env.VITE_AVATAR_BASE_URL

function Nav_Bar(props) {

    // ---------------- Profile ------------------
    const { profile } = useContext(User_API_Context);
    const [avatarSeed, setAvatarSeed] = useState(profile?.avatar_seed || "");
    const navigate = useNavigate();
    

    // ************** handle Enter Profile ***************
    const handleEnterProfile = async () => {
        try {
            setSidebarOpen(false); // Close sidebar when navigating to profile
            navigate("/User/Profile")
        } catch {
            return
        }
    }

    // ************** handle LogOut ***************
    const handleEnterGame = async () => {
        try {
            window.open("https://escape-road-140.netlify.app/", "_blank")
        } catch {
            return
        }
    };


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

  // ------------------- EFFECT: Disable Body Scroll when Sidebar is Open -------------------
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        // Cleanup on unmount
        return () => { document.body.style.overflow = "auto"; };
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
        setSidebarOpen(false); // Close sidebar after clicking section link
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                const offset = -100;
                const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: elementPosition + offset, behavior: "smooth" });
            }
        }, 120);
    };


    // ************* Fetch Github Star and Show in Navbar ******************
    const [stars, setStars] = useState(0);
    useEffect(() => {
        const cachedStars = sessionStorage.getItem("repo_stars");
        if (cachedStars) {
            setStars(JSON.parse(cachedStars));
            return;
        }
        const fetchStars = async () => {
            try {
                const response = await fetch("https://api.github.com/repos/Sujan-Rai-426/CodeVora");
                const data = await response.json();
                const count = data.stargazers_count || 0;
                setStars(count);
                sessionStorage.setItem("repo_stars", JSON.stringify(count));
            } catch (error) {
                console.error(error);
            }
        };
        fetchStars();
    }, []);


  // ------------------- JSX RENDER -------------------
    return (
        <>

    {/* ************************************************************************ */}
        {/* ===================== Desktop Navbar ===================== */}
            <nav className="navbar-custom nb-navbar-standard sticky-top" role="navigation">
                <div className="nav-container">

                    {/* ====== Left / Brand Name ======= */}
                    <Link to="/Admin/Login" className="brand">
                        <b>Code</b>
                        <sup>
                            <u>
                                <small>Vora</small>💻
                            </u>
                        </sup>
                    </Link>


                    {/* ========= Center / profile + menu======= */}
                    <div className="nav-right">
                        {/* Mobile hamburger -->  ☰ */}
                        <button className="nb-hamburger d-lg-none" onClick={toggleSidebar} aria-label="Open menu">
                            <i className="bi bi-justify-right"></i>
                        </button>

                        {/* Desktop nav */}
                        <ul className="nb-nav-list d-none d-lg-flex">
                            {/* Home */}
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

                            {/* Template */}
                            <li className="nb-nav-item">
                                <Link to="/Templates/Topics" className="nb-nav-link" onClick={() => scrollToSection('TEMPLATES')}>Templates</Link>
                            </li>

                            {/* Components */}
                            <li className="nb-nav-item">
                                <Link to={`/Components/Topics/1`} className="nb-nav-link">Components</Link>
                            </li>

                            {/* Programming */}
                            <li className="nb-nav-item">
                                <Link to={`/Code-Guide/Topic/2`} className="nb-nav-link">Programming</Link>
                            </li>
                        </ul>
                    </div>


                    {/* =========== Right  Github / Profile ========== */}
                    <div className="n-desktop-profile-github-container">
                        {/* ***********GITHUB************* */}
                        <a 
                            href="https://github.com/Sujan-Rai-426/CodeVora" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-decoration-none"
                        >
                            <button className="btn custom-rainbow-btn d-inline-flex align-items-center border-0 position-relative desktop-github-btn">
                                <div className="d-flex align-items-center border-end pe-2 me-2">
                                    <svg className="github-icon" width="16" height="16" viewBox="0 0 438.549 438.549">
                                        <path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z" fill="currentColor"></path>
                                    </svg>
                                    <span className="ms-1 fw-medium small n-desktop-github-txt">Star on GitHub</span>
                                </div>
                                <div className="d-flex align-items-center star-container">
                                    <svg className="star-icon me-1" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"></path>
                                    </svg>
                                    <span className="small fw-bold">{stars}</span>
                                </div>
                            </button>
                        </a>

                        {/* ****** User Profile / Login ****** */}
                        <div className="n-desktop-profile">
                            <Link to="/User/Profile/" className="nav-client-login-btn n-desktop-account-btn"> <FaUser /> <span>Account</span></Link>
                        </div>

                                            {/* Triggre button to toggle the mode */}
                    <Link onClick={props.toggleMode} className='px-10'> 
                        <b>
                            {props.mode.backgroundColor === '#f5f7fa' ? (
                                <i className="bi bi-brightness-high-fill mx-3 fs-3"></i>
                            ) : (
                                <i className="bi bi-brightness-low-fill mx-3 fs-3"></i>
                            )}
                        </b>
                    </Link>
                    </div>
                    
                </div>
            </nav>





    {/* ********************************************************************************************* */}
        {/* ===================== Mobile Sidebar ===================== */}
            <aside 
                className={`nb-sidebar-container ${sidebarOpen ? "open" : ""}`} 
                ref={sidebarRef} 
                role="dialog" 
                aria-modal="true"
                style={{ overflowY: 'auto' }} 
            >

                {/********** Toggle Close Button / Github button **********/}
                <div className="n-sidebar-head">
                    {/* =========== Github Button ========== */}
                    <a 
                        href="https://github.com/Sujan-Rai-426/CodeVora" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-decoration-none"
                    >
                        <button className="btn custom-rainbow-btn d-inline-flex align-items-center border-0 position-relative">
                            <div className="d-flex align-items-center border-end pe-2 me-2">
                                <svg className="github-icon" width="16" height="16" viewBox="0 0 438.549 438.549">
                                    <path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z" fill="currentColor"></path>
                                </svg>
                                <span className="ms-1 fw-medium small n-mobile-github-txt">Star on GitHub</span>
                            </div>
                            <div className="d-flex align-items-center star-container">
                                <svg className="star-icon me-1" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"></path>
                                </svg>
                                <span className="small fw-bold">{stars}</span>
                            </div>
                        </button>
                    </a>
                    
                    {/* ===========Navbar Close Button ========== */}
                    <button className="nb-sidebar-close" onClick={toggleSidebar} aria-label="Close menu">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>


                {/* ************ Toggle Navbar List Open *********** */}
                <ul className="nb-sidebar-list">

                {/* ==== User Profile / Login ==== */}
                    <div className="nav-client-sidebar-section nav-user-profile">
                        {profile ? (
                            <>
                                <div className="nav-client-profile-info-wrapper">
                                    <img
                                        src={avatarSeed ? `${AVATAR_BASE_URL}?seed=${avatarSeed}` : CodeVora_Logo}
                                        alt="Avatar"
                                        className="nav-client-profile-avatar"
                                    />
                                    <div className="profile-text-details">
                                        <span className="nav-username">{profile.username || "User"}</span>
                                        <span className="nav-email">{profile.email || "user@example.com"}</span>
                                    </div>
                                </div>

                                <div className="profile-btn-grp">
                                    <button className="nav-client-profile-edit-btn" onClick={handleEnterProfile}><FaUser /> Profile</button>
                                    <button className="nav-client-play-game-btn" onClick={handleEnterGame}><FaPlay /> Games</button>
                                </div>
                            </>
                        ) : (
                            <div className="nav-client-auth-buttons">
                                <Link to="/User/Login/" className="nav-client-login-btn" onClick={() => setSidebarOpen(false)}> <FaSignInAlt /> Login</Link>
                                <Link to="/User/Signup/" className="nav-client-signup-btn" onClick={() => setSidebarOpen(false)}> <FaUserPlus /> Signup</Link>
                            </div>
                        )}
                    </div>
                    
                        <li><hr className="sidebar-divider" /></li>

                {/* HOME */}
                    <li>
                        <Link to="/" onClick={() => setSidebarOpen(false)}>
                            <i className="bi bi-house-fill"></i> &nbsp; Home
                        </Link>
                    </li>

                {/* ABOUT dropdown */}
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

                {/* TEMPLATES */}
                    <li>
                        <Link to="/Templates/Topics" onClick={() => scrollToSection('TEMPLATES')}>
                            <i className="bi bi-columns"></i> &nbsp; Templates
                        </Link>
                    </li>
                
                {/* COMPONENTS */}
                    <li>
                        <Link to="/Components/Topics/1" onClick={() => setSidebarOpen(false)}>
                            <i className="bi bi-stack"></i> &nbsp; Components
                        </Link>
                    </li>
                
                {/* CODE-GUIDE / PROGRAMMING */}
                    <li>
                        <Link to="/Code-Guide/Topic/2" onClick={() => setSidebarOpen(false)}>
                            <i className="bi bi-journal-code"></i> &nbsp; Programming
                        </Link>
                    </li>
                
                {/* CONTACT US */}
                    <li>
                        <Link to="/Contact" onClick={() => setSidebarOpen(false)}>
                            <i className="bi bi-chat-text-fill"></i> &nbsp; Contact Us
                        </Link>
                    </li>

                        <li><hr className="sidebar-divider" /></li>

                </ul>
                
            </aside>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && <div className="nb-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        </>
    );
}

export default Nav_Bar;