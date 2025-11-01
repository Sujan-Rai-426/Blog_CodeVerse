import React from "react";

const Privacy_Policy = () => {
    return (
        <div className="container my-5 text-light">
            <div className="card bg-dark border-0 shadow-lg p-4">
                <div className="card-body">
                <h2 className="text-center mb-4 text-warning">
                    <u>Privacy Policy</u>
                </h2>
                <p className="lead">
                    Welcome to <strong>CodeVerse💻</strong>. Your privacy is important to
                    us. This Privacy Policy explains how we collect, use, and protect
                    your information when you use our website.
                </p>

                <h5 className="mt-4 text-info">1. Information We Collect</h5>
                <p>
                    We may collect personal information such as your name, email
                    address, and other details you provide during registration or
                    contact. Non-personal data like browser type and usage statistics may
                    also be collected automatically.
                </p>

                <h5 className="mt-4 text-info">2. How We Use Your Information</h5>
                <p>
                    We use your information to improve user experience, respond to
                    inquiries, personalize content, and ensure smooth platform
                    functionality.
                </p>

                <h5 className="mt-4 text-info">3. Data Protection</h5>
                <p>
                    We prioritize your data security. All collected information is kept
                    confidential and protected against unauthorized access.
                </p>

                <h5 className="mt-4 text-info">4. Cookies</h5>
                <p>
                    CodeVerse💻 uses cookies to enhance browsing experience and analyze
                    traffic. You can choose to disable cookies through your browser
                    settings.
                </p>

                <h5 className="mt-4 text-info">5. Third-Party Services</h5>
                <p>
                    Our website may contain links to third-party websites. We are not
                    responsible for their privacy practices or content.
                </p>

                <h5 className="mt-4 text-info">6. Changes to This Policy</h5>
                <p>
                    We may update our Privacy Policy from time to time. Updates will be
                    reflected on this page with the latest revision date.
                </p>

                <h5 className="mt-4 text-info">7. Contact Us</h5>
                <p>
                    If you have any questions or concerns about this Privacy Policy,
                    please contact us at{" "}
                    <a href="mailto:support@codeverse.com" className="text-decoration-none text-warning">
                    support@codeverse.com
                    </a>
                    .
                </p>

                <div className="text-center mt-4">
                    <small className="text-secondary">
                    © {new Date().getFullYear()} CodeVerse💻. All rights reserved.
                    </small>
                </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy_Policy;
