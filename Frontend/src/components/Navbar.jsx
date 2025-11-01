import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Navbar.css';

function Navbar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <>
            {/* Top Desktop Navbar */}
            <nav className="navbar navbar-dark navbar-custom sticky-top d-flex justify-content-between px-3">
                <Link className="navbar-brand fw-bold px-4" to="/">
                    <b>Code</b><sup><u><small>Verse</small>💻</u></sup>
                </Link>

                {/* Hamburger button for mobile */}
                <button className="btn btn-outline-light d-lg-none" onClick={toggleSidebar}>
                    ☰
                </button>

                {/* Desktop links */}
                <div className="d-none d-lg-flex align-items-center navbar-nav">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/About" className="nav-link">About</Link>
                    <Link to="/" className="nav-link">Pricing</Link>
                    <a href="https://www.sujan140.com.np" target="_blank" rel="noopener noreferrer" className="nav-link">Developer</a>
                    <Link to="https://blog-codeverse.onrender.com/" className="btn btn-outline-light btn-sm ms-3">Admin 💻</Link>
                </div>
            </nav>

            {/* Sidebar for mobile */}
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <button className="close-btn" onClick={toggleSidebar}>×</button>
                <ul className="sidebar-nav">
                    <li><Link to="/" onClick={toggleSidebar}>Home</Link></li>
                    <li><Link to="/About" onClick={toggleSidebar}>About</Link></li>
                    <li><Link to="/Privacy_Policy" onClick={toggleSidebar}>Privacy Policy</Link></li>
                    <li><a href="https://www.sujan140.com.np" target="_blank" rel="noopener noreferrer" onClick={toggleSidebar}>Developer</a></li>
                    <li><Link to="https://blog-codeverse.onrender.com/" onClick={toggleSidebar}>Admin 💻</Link></li>
                </ul>
            </div>

            {/* Overlay when sidebar is open */}
            {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
        </>
    );
}

export default Navbar;
