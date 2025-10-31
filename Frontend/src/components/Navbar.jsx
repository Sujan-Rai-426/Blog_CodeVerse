import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Navbar.css';

function Navbar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <>
            {/* Top Navbar */}
            <nav className="navbar navbar-dark navbar-custom sticky-top d-flex justify-content-between px-3">
                <Link className="navbar-brand fw-bold px-4" to="/">
                    Code <sup><u>Verse</u></sup>
                </Link>

                <button className="btn btn-outline-light d-lg-none" onClick={toggleSidebar}>
                    ☰
                </button>

                <div className="d-none d-lg-flex align-items-center">
                    <Link to="/" className="nav-link text-light me-3">Home</Link>
                    <Link to="/" className="nav-link text-light me-3">About</Link>
                    <Link to="/" className="nav-link text-light me-3">Pricing</Link>
                    <Link to="https://www.sujan140.com.np" target="_blank" rel="noopener noreferrer" className="nav-link text-light me-3">Developer</Link>
                    <Link to="http://127.0.0.1:8000/admin/" className="btn btn-outline-light btn-sm">Admin 💻</Link>
                </div>
            </nav>

            {/* Sidebar for small screens */}
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <button className="close-btn" onClick={toggleSidebar}>×</button>
                    <ul className="sidebar-nav">
                        <li><Link to="/" onClick={toggleSidebar}>Home</Link></li>
                        <li><Link to="/" onClick={toggleSidebar}>About</Link></li>
                        <li><Link to="/" onClick={toggleSidebar}>Pricing</Link></li>
                        <li><Link to="https://www.sujan140.com.np" target="_blank" rel="noopener noreferrer" onClick={toggleSidebar}>Developer</Link></li>
                        <li><Link to="http://127.0.0.1:8000/admin/" onClick={toggleSidebar}>Admin 💻</Link></li>
                    </ul>
            </div>

            {/* Overlay when sidebar is open */}
            {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
        </>
    );
}

export default Navbar;
