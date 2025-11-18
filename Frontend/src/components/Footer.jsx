
import { Link  }from 'react-router-dom'; 
import '../assets/css/Footer.css'; 

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p>&copy; {new Date().getFullYear()} Er.Sujan Rai. All rights reserved.</p>
                <div className="footer-links">
                    <Link to="Contact">Contact</Link>
                    <Link to="/Privacy_Policy">Privacy Policy</Link>
                    <a href="https://dev.to/sujanrai426">Dev.to</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;