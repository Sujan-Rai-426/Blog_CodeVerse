

import React, { useEffect, useRef, useState } from 'react';
import * as CodeVora from "codevora-ui";
import "./assets/css/Library_Body.css";
import "./assets/css/Library.css";

import Prism from "prismjs";

import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-bash";
import { FaFacebook, FaFacebookMessenger, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import Interactive_Grid_Background from '../Home/context/Interactive_Grid_Background';

const Library_Body = ({ componentId }) => {
    
    // Trigger Prism highlighting on mount and when componentId changes
    useEffect(() => {
        Prism.highlightAll();
    }, [componentId]);

    const libraryComponents = [
        {
            id: "matrix-bg",
            topic_id: "backgrounds",
            created_at: "2025-12-28" ,
            title: "Matrix Rain Effect",
            description: "An ultra-smooth digital rain canvas component. Optimized for background usage in landing pages and high-tech dashboards.",
            config: {
                name: "MatrixBackground",
                childrenText: "SYSTEM ACCESS GRANTED",
            },
            usage: `<MatrixBackground speed={1}>\n  <div style={{minHeight:'100vh'}}>\n      Here is your Body\n  </div>\n</MatrixBackground>`,
        }
    ];

    const activeComp = libraryComponents.find(c => c.id === componentId);

    // --- Helper Component: Copy Button ---
    const CopyButton = ({ text }) => {
        const [copied, setCopied] = useState(false);

        const handleCopy = () => {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };

        return (
            <button className={`lib-copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
                {copied ? <><i className="bi bi-check2"></i> Copied</> : <><i className="bi bi-clipboard"></i> Copy</>}
            </button>
        );
    };


    /**
     * Internal Dynamic Renderer
     */
    if (!activeComp) return <div className="error">Component Not Found</div>;

    const DynamicPreview = ({ config }) => {
        const Component = CodeVora[config.name] || config.name;
        const isBackground = config.name.toLowerCase().includes("background");
        return (
            <Component {...config.props}>
                {isBackground ? (
                    <div style={{ zIndex: 5, position: 'relative', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.2rem', marginTop: '3rem', letterSpacing: '10px', color: '#fff', textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>
                            {config.childrenText}
                        </h2>
                    </div>
                ) : config.childrenText}
            </Component>
        );
    };



        // handle Share Click LOGIC
    const handleShareClick = (platform) => {
        const realUrl = window.location.href;
        const encodedRealUrl = encodeURIComponent(realUrl);
        const pageTitle = encodeURIComponent(currentCodes.title || document.title);
        let shareUrl = "";
        switch (platform) {
            case "Messenger":
                shareUrl = `https://www.facebook.com/dialog/send?link=${encodedRealUrl}&app_id=1949440582581236&redirect_uri=${encodedRealUrl}`;
                break;
            case "WhatsApp":
                shareUrl = `https://wa.me/?text=${pageTitle}%20${encodedRealUrl}`;
                break;
            case "Facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedRealUrl}`;
                break;
            case "Telegram":
                shareUrl = `https://t.me/share/url?url=${encodedRealUrl}&text=${pageTitle}`;
                break;
            default:
                navigator.clipboard.writeText(realUrl);
                alert("Link copied!");
                return;
        }
        window.open(shareUrl, "_blank", "width=600,height=500");
    };


    // ----------> Handle Scroll To DOC Section
    const docsRef = useRef(null);
    const scrollToDocsSection = () => {
        docsRef.current?.scrollIntoView({ behaviour:"smooth" });
    }



    return (
<Interactive_Grid_Background>
        <div className="component-page-container container">
    {/* ------------------------------------------------------- */}
            {/* 1. HEADER: Descriptoion Toppic */}
    {/* ------------------------------------------------------- */}
            <header className='header'>
                <section className='header-top'>
                    {/* Topic Title */}
                    <div>
                        <span className="topic-badge">{activeComp.topic_id}</span>
                        <h1 className="component-title">{activeComp.title}</h1>
                    </div>

                    {/* SHARE */}
                    <div className="share-dropdown">
                        <button className="action-btn share-btn lib-share-btn" title="Share">
                            <i className="fa fa-share-alt" />
                        </button>
                        <div className="share-options">
                            <span onClick={() => handleShareClick("WhatsApp")}><FaWhatsapp className="share-icon" /> WhatsApp</span>
                            <span onClick={() => handleShareClick("Messenger")}><FaFacebookMessenger className="share-icon" /> Messenger</span>
                            <span onClick={() => handleShareClick("Facebook")}><FaFacebook className="share-icon" /> Facebook</span>
                            <span onClick={() => handleShareClick("Telegram")}><FaTelegram className="share-icon" /> Telegram</span>
                        </div>
                    </div>
                </section>
                
                <small><p className="description-text">{activeComp.description}</p></small>
            </header>



    {/* ------------------------------------------------------- */}
            {/* 2. ACTIONS: Action Buttons */}
    {/* ------------------------------------------------------- */}
            <section className="lib-action-btns">
                <button className="lib-btn btn-primary" onClick={scrollToDocsSection}>
                    <i className="bi bi-book"></i> <span>Docs</span>
                </button>
                <a href="https://github.com/Sujan-Rai-426/CodeVora" className="lib-btn btn-outline">
                    <i className="bi bi-star-fill" style={{color: '#f59e0b'}}></i> GitHub <span> Star</span>
                </a>
                <a href="https://github.com/Sujan-Rai-426/CodeVora-UI-Library" className="lib-btn btn-gold">
                    <i className="bi bi-git"></i> Contribute
                </a>
            </section>



    {/* ------------------------------------------------------- */}
            {/* 3. STAGE: The Live Visual Preview */}
    {/* ------------------------------------------------------- */}
            <section className="hero-visual-stage">
                <DynamicPreview config={activeComp.config} />
            </section>



    {/* ------------------------------------------------------- */}
            {/* 4. SPECS: Details & Documentation */}
    {/* ------------------------------------------------------- */}
            <section ref={docsRef} style={{scrollMarginTop: "30px"}} className="content-specs">
                <div className="specs-grid">

                    {/* Installation Card */}
                    <div className="spec-card">
                        <div className="spec-header">
                            <h4>PACKAGE MANAGER</h4>
                            <CopyButton text="npm i codevora-ui" />
                        </div>
                        <p><small>Command to install the core package</small></p>
                        <div className="code-snippet language-jsx"><code>npm i codevora-ui</code></div>
                    </div>

                    {/* Import Card */}
                    <div className="spec-card">
                        <div className="spec-header">
                            <h4>IMPORT</h4>
                            <CopyButton text={`import { ${activeComp.config.name} } from "codevora-ui"`} />
                        </div>
                        <p><small>Add this to top of your React file</small></p>
                        <pre className="code-snippet language-jsx">
                            <code>{`import { ${activeComp.config.name} } from "codevora-ui"`}</code>
                        </pre>
                    </div>

                    {/* Usage Card */}
                    <div className="spec-card usage-wide">
                        <div className="spec-header">
                            <h4>REACT USAGE</h4>
                            <CopyButton text={activeComp.usage} />
                        </div>
                        <p><small>Here’s a simple example of how to use this component</small></p>
                        <pre className="code-snippet language-jsx">
                            <code>{activeComp.usage}</code>
                        </pre>
                    </div>
                </div>
            </section>
        </div>
</Interactive_Grid_Background>
    );
};

export default Library_Body;