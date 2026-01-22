
import { Link  }from 'react-router-dom'; 
import './assets/css/Footer.css'; 

const Footer = () => {

    // Scroll to section function using id
    const scrollToSection = (id) => {
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                const offset = -100; // scroll 100px more upwards (adjust as needed)
                const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                const finalPosition = elementPosition + offset;

                window.scrollTo({
                    top: finalPosition,
                    behavior: "smooth",
                });
            }
        }, 120); // wait for react-router navigation
    };


    return (


        <div>
            {/* =============== Semi Footer Section =============== */}
                <section className="semi-footer-alt pt-5 p-3">
                    <div className="semi-footer-alt-container container">
                        {/* About / Brand */}
                        <div className="footer-brand">
                            <h3 className="brand-title"><b> CodeVora UI </b></h3>
                            <p className="brand-text text-white">
                                Turning ideas into reality with high-quality tutorials, resources, and creative projects for developers.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-links">
                            <h5>Quick Links</h5>
                            <ul>
                                <li><Link to="/" onClick={() => scrollToSection('FRONTEND_TUTORIALS')}>Components</Link></li>
                                <li><Link to="/" onClick={() => scrollToSection('CODING_GUIDE')}>Programming</Link></li>
                                {/* <li><Link to="/">Projects & Services</Link></li> */}
                                <li><Link to="/Contact">Contact US</Link></li>
                            </ul>
                        </div>

                        {/* Resources / More */}
                        <div className="footer-resources">
                            <h5>Resources</h5>
                            <ul>
                                <li><a href="https://er-sujan.vercel.app">Blog</a></li>
                                {/* <li><Link to="/Contact">FAQ</Link></li> */}
                                <li><Link to="/About">About Us</Link></li>
                                <li><Link to="/Contact">Support</Link></li>
                                <li><Link to="/Privacy_Policy">Terms & Privacy</Link></li>
                            </ul>
                        </div>

                        {/* Social + Mini CTA */}
                        <div className="footer-social">
                            <h5>Connect with Us</h5>
                            <div className="social-icons">
                                <a href="https://www.youtube.com/@CodeVora140"><i className="bi bi-youtube"></i></a>
                                <a href="https://www.facebook.com/profile.php?id=61583606692743"><i className="bi bi-facebook"></i></a>
                                <a href="https://github.com/Sujan-Rai-426"><i className="bi bi-github"></i></a>
                                <a href="https://www.instagram.com/codevora140/"><i className="bi bi-instagram"></i></a>
                                <a href="https://www.linkedin.com/company/109567566/admin/page-posts/published/"><i className="bi bi-linkedin"></i></a>
                            </div>
                            <p className="mini-cta mt-3">
                                <small>Subscribe to get updates & new tutorials weekly!</small>
                            </p>
                        </div>
                    </div>
                </section>



            {/* =============== MAIN FOOTER =============== */}
                <footer className="footer">
                    <div className="footer-container">
                        <p className='mb-4'>&copy; {new Date().getFullYear()} Sujan Rai. All rights reserved.</p>
                        <div className="footer-links mb-4">
                            <Link to="Contact">Contact</Link>
                            <a href="https://er-sujan.vercel.app">Developer</a>
                            {/* <Link to="/Admin">Admin</Link> */}
                        </div>
                    </div>
                </footer>
        </div>
    );
};

export default Footer;