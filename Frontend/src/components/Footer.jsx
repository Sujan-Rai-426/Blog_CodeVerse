
import React from 'react';
import { Link  }from 'react-router-dom'; 
import '../assets/css/Footer.css'; 

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p>&copy; {new Date().getFullYear()} Er.Sujan Rai. All rights reserved.</p>
                <div className="footer-links">

                    
                    <Link to="/About">About</Link>
                    <Link to="https://www.sujan140.com.np/contact">Contact</Link>
                    <Link to="/Privacy_Policy">Privacy Policy</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;