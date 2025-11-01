import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Nav_Bar.css';

function Nav_Bar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      <nav className="navbar navbar-dark navbar-custom sticky-top d-flex justify-content-between px-3">
        <Link className="navbar-brand fw-bold px-4" to="/">
          <b>Code</b><sup><u><small>Verse</small>💻</u></sup>
        </Link>

        <button className="btn btn-outline-light d-lg-none" onClick={toggleSidebar}>
          ☰
        </button>

        <div className="d-none d-lg-flex align-items-center navbar-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/About" className="nav-link">About</Link>
          <Link to="/Privacy_Policy" className="nav-link">Privacy Policy</Link>
          <a href="https://www.sujan140.com.np" target="_blank" rel="noopener noreferrer" className="nav-link">Developer</a>
          <a href="https://blog-codeverse.onrender.com/" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light btn-sm ms-3">Admin 💻</a>
        </div>
      </nav>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>×</button>
        <ul className="sidebar-nav">
          <li><Link to="/" onClick={toggleSidebar}>Home</Link></li>
          <li><Link to="/About" onClick={toggleSidebar}>About</Link></li>
          <li><Link to="/Privacy_Policy" onClick={toggleSidebar}>Privacy Policy</Link></li>
          <li><a href="https://www.sujan140.com.np" target="_blank" rel="noopener noreferrer" onClick={toggleSidebar}>Developer</a></li>
          <li><a href="https://blog-codeverse.onrender.com/" target="_blank" rel="noopener noreferrer" onClick={toggleSidebar}>Admin 💻</a></li>
        </ul>
      </div>

      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
}

export default Nav_Bar;
