import React from 'react';

const Privacy_Policy = () => {
    return (
        <div className="container my-5">
            <h1 className="mb-4 text-center">Privacy Policy</h1>
            
            <div className="card p-4 shadow-sm text-white">
                <p>
                    At <strong>CodeVerse</strong>, your privacy is important to us. We do <strong>not collect any personal data</strong> from our users.
                </p>
                
                <p>
                    However, please note that third-party advertisers on our platform <strong>may collect certain information</strong> for advertising purposes. We recommend reviewing their privacy policies for details.
                </p>
                
                <p>
                    By using our platform, you acknowledge and accept that while we do not collect your data, advertisers may do so.
                </p>
                
                <p className="text-muted"><small>Last updated: November 2, 2025</small></p>
            </div>
        </div>
    );
}

export default Privacy_Policy;
