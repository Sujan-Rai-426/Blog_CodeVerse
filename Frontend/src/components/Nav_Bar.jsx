import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../assets/css/Nav_Bar.css";

function Nav_Bar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false); // desktop/tablet dropdown state
  const [aboutMobileOpen, setAboutMobileOpen] = useState(false); // sidebar dropdown state
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const aboutRef = useRef(null); // desktop dropdown wrapper
  const sidebarRef = useRef(null);

  useEffect(() => {
    // detect touch / coarse pointer devices
    const checkTouch = () => {
      // matchMedia pointer:coarse is a good hint for touch
      const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
      // also check user agent as fallback
      const uaTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(coarse || uaTouch);
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  // Close dropdown when clicking outside (desktop/tablet)
  useEffect(() => {
    function onDocClick(e) {
      if (aboutRef.current && !aboutRef.current.contains(e.target)) {
        setAboutOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [sidebarOpen]);

  const toggleSidebar = (e) => {
    e.stopPropagation();
    setSidebarOpen((s) => !s);
  };

  // Desktop: open on hover only if not a touch device and width >= 992
  const handleAboutMouseEnter = () => {
    if (!isTouchDevice && window.innerWidth >= 992) {
      setAboutOpen(true);
    }
  };
  const handleAboutMouseLeave = () => {
    if (!isTouchDevice && window.innerWidth >= 992) {
      setAboutOpen(false);
    }
  };

  // Click handler (tablet & accessibility): toggle on click when touch device OR narrow screen
  const handleAboutClick = (e) => {
    // prevent navigation
    e.preventDefault();
    // toggle only for touch devices or narrow screens
    if (isTouchDevice || window.innerWidth < 992) {
      setAboutOpen((s) => !s);
    }
  };

  // Mobile sidebar dropdown toggle
  const toggleAboutMobile = () => setAboutMobileOpen((s) => !s);

  return (
    <>
      <nav className="navbar-custom navbar-standard sticky-top" role="navigation">
        <div className="nav-container">
          <Link to="/" className="brand">
            <b>Code</b>
            <sup>
              <u>
                <small>Vora</small>💻
              </u>
            </sup>
          </Link>

          {/* Right actions: mobile toggle + desktop menu */}
          <div className="nav-right">
            {/* mobile hamburger */}
            <button
              className="hamburger d-lg-none"
              onClick={toggleSidebar}
              aria-label="Open menu"
            >
              ☰
            </button>

            {/* Desktop / Tablet nav */}
            <ul className="nav-list d-none d-lg-flex" >
                <li className="nav-item"> <Link to="/" className="nav-link">Home</Link> </li>
                <li className="nav-item"> <Link to="/Contact" className="nav-link">Contact</Link> </li>
                <li className="nav-item"> <Link to="/PlayGround" className="nav-link">PlayGround</Link> </li>

                {/* ABOUT dropdown (desktop hover, tablet click) */}
                <li className={`nav-item nav-dropdown ${aboutOpen ? "open" : ""}`} ref={aboutRef} onMouseEnter={handleAboutMouseEnter} onMouseLeave={handleAboutMouseLeave} >
                    {/* Use button-like span so Link doesn't navigate */}
                    <a href="#about" className="nav-link dropdown-toggle" onClick={handleAboutClick} aria-expanded={aboutOpen} >
                      About <span className={`caret ${aboutOpen ? "open" : ""}`}>▾</span>
                    </a>

                    <div className={`dropdown-panel ${aboutOpen ? "visible" : ""}`}>
                      <Link className="dropdown-item" to="/About"> <i className="bi bi-people-fill"></i> Our Team </Link>
                      <a className="dropdown-item" href="https://sujan140.vercel.app"> <i className="bi bi-person-fill"></i> Developer </a>
                      <Link className="dropdown-item" to="/Privacy_Policy"> <i className="bi bi-shield-lock-fill"></i> Terms & Policy </Link>
                    </div>
                </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Sidebar (mobile) */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} ref={sidebarRef} role="dialog" aria-modal="true">
          <button className="sidebar-close" onClick={toggleSidebar} aria-label="Close menu">×</button>

          <ul className="sidebar-list">
              <li>
                  <button className="sidebar-dropdown-btn" onClick={toggleAboutMobile} aria-expanded={aboutMobileOpen}>
                      <i className="bi bi-file-earmark-person-fill"></i> &nbsp; About <span className={`fs-4 caret ${aboutMobileOpen ? "open" : ""}`}>▾</span>
                  </button>
                  <ul className={`sidebar-sublist ${aboutMobileOpen ? "open" : ""}`}>
                      <li><Link to="/About" onClick={() => setSidebarOpen(false)}> <i className="bi bi-people-fill"></i> &nbsp; Our Team </Link></li>
                      <li><a href="https://sujan140.vercel.app" onClick={() => setSidebarOpen(false)}> <i className="bi bi-person-fill"></i> &nbsp;  Developer </a></li>
                      <li><Link to="/Privacy_Policy" onClick={() => setSidebarOpen(false)}> <i className="bi bi-shield-lock-fill"></i> &nbsp; Terms & Policy </Link></li>
                  </ul>
              </li>

              <li><Link to="/" onClick={() => setSidebarOpen(false)}> <i className="bi bi-house-fill"></i> &nbsp; Home</Link></li>
              <li><Link to="/Contact" onClick={() => setSidebarOpen(false)}> <i className="bi bi-chat-text-fill"></i> &nbsp; Contact</Link></li>
              <li><Link to="/PlayGround" onClick={() => setSidebarOpen(false)}> <i className="bi bi-joystick"></i> &nbsp; PlayGround</Link></li>
          </ul>
      </aside>

      {/* overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} /> }
    </>
  );
}

export default Nav_Bar;
