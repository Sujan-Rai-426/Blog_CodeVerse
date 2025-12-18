import React from 'react';

const Privacy_Policy = () => {
    return (
        <div className="container my-5" style={{ minHeight: "100vh" }}>
            <h1 className="mb-4 text-center text-warning">Privacy Policy</h1>

            <div className="card p-4 shadow-sm text-white" style={{ textAlign: "justify", lineHeight: "1.7" }}>
                <p>
                    At <strong>CodeVerse</strong>, your privacy is extremely important to us. This Privacy Policy explains how we
                    handle your information when you visit and use our website.
                </p>

                <h5 className="mt-4 text-warning">1. Information We Collect</h5>
                <p>
                    We do <strong>not collect, store, or share</strong> any personal information such as your name, email address,
                    or contact details when you browse or use our website. All features and content on CodeVerse are fully
                    accessible without requiring any personal data submission.
                </p>

                <h5 className="mt-4 text-warning">2. Cookies and Third-Party Advertisements</h5>
                <p>
                    While CodeVerse itself does not use cookies or tracking technologies, our website may display
                    <strong> third-party advertisements</strong> (such as Google AdSense or other ad networks).
                </p>
                <p>
                    These third parties may use cookies, web beacons, or similar technologies to:
                </p>
                <ul>
                    <li>Show ads based on your previous visits to this or other websites.</li>
                    <li>Measure ad performance and improve relevance.</li>
                    <li>Analyze website traffic and user behavior anonymously.</li>
                </ul>
                <p>
                    Please note that <strong>CodeVerse</strong> has no access to or control over these cookies or the data
                    collected by advertisers.
                </p>
                <p>
                    To learn more about how Google uses information from sites that use its services, visit:<br />
                    <a
                        href="https://policies.google.com/technologies/partner-sites"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-info"
                    >
                        https://policies.google.com/technologies/partner-sites
                    </a>
                </p>
                <p>
                    You can opt out of personalized advertising by visiting:<br />
                    <a
                        href="https://adssettings.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-info"
                    >
                        https://adssettings.google.com/
                    </a>
                </p>

                <h5 className="mt-4 text-warning">3. Third-Party Links</h5>
                <p>
                    Our website may contain links to external websites. Once you click on a third-party link, you will be directed
                    to their site. We are <strong>not responsible</strong> for the privacy practices or content of those external
                    websites. We recommend reviewing their privacy policies to understand how they handle your data.
                </p>

                <h5 className="mt-4 text-warning">4. Children's Privacy</h5>
                <p>
                    CodeVerse is not intended for children under the age of 13, and we do not knowingly collect personal
                    information from minors. If you believe your child has provided any personal data to us, please contact us,
                    and we will promptly remove such information from our records.
                </p>

                <h5 className="mt-4 text-warning">5. Policy Updates</h5>
                <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices, comply with legal
                    requirements, or address new operational needs. Any updates will be posted on this page with a revised
                    “Last Updated” date.
                </p>

                <h5 className="mt-4 text-warning">6. Your Consent</h5>
                <p>
                    By using our website, you acknowledge and agree to this Privacy Policy. You also understand that while
                    <strong> CodeVerse</strong> does not collect your personal data, <strong>third-party advertisers</strong> may
                    collect limited information for advertising and analytical purposes.
                </p>

                <h5 className="mt-4 text-warning">7. Contact Us</h5>
                <p>
                    If you have any questions, suggestions, or concerns about this Privacy Policy, please feel free to reach out
                    to us at:<br />
                    📧{" "}
                    <a href="mailto:codevora140@gmail.com" className="text-info">
                        rsujan140.in@gmail.com
                    </a>
                </p>

                <p className="text-muted mt-4">
                    <small>Last Updated: November 6, 2025</small>
                </p>
            </div>
        </div>
    );
};

export default Privacy_Policy;
