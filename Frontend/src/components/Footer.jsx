
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
                    <a href="https://www.sujan140.com.np/contact">Contact</a>
                    <Link to="/Privacy_Policy">Privacy Policy</Link>
                    <a href="https://dev.to/sujanrai426">Dev.to</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;