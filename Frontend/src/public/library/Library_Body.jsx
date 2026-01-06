

import React, { useEffect, useRef, useState } from 'react';
import * as CodeVora from "codevora-ui";
import "./assets/css/Library_Body.css";
import "./assets/css/Library.css";

import Prism from "prismjs";

import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-bash";
import { FaFacebook, FaFacebookMessenger, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { use_Library_API } from './Library_API_Context';
import Skeleton from 'react-loading-skeleton';


const Library_Body = ({ componentId }) => {
    const {libraryComponents, error, loading} = use_Library_API();
    
    
    // ----------> Handle Scroll To DOC Section
    const docsRef = useRef(null);
    const scrollToDocsSection = () => {
        docsRef.current?.scrollIntoView({ behaviour:"smooth" });
    }



    // ---------> Use Prism Highlight  for code
    useEffect(() => {
        Prism.highlightAll();
    }, [componentId]);



    
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




    //     const DynamicPreview = ({ config }) => {
    //     if (!config) return null;
    //     const { name, childrenText, ...componentProps } = config;
    //     const Component = CodeVora[name] || name;
        
    //     // Check if the component is a background or a button
    //     const isBackground = name.toLowerCase().includes("background");
    //     const isButton = name.toLowerCase() === "button";

    //     return (
    //         <div style={{ 
    //             position: 'relative', 
    //             width: '100%', 
    //             height: '100%', 
    //             display: 'flex', 
    //             alignItems: 'center', 
    //             justifyContent: 'center',
    //             overflow: 'hidden',
    //             background: '#11111116',
    //             borderRadius: '8px'
    //         }}>
    //             <Component 
    //                 {...componentProps}
    //                 // Attach onClick ONLY if the component is a Button
    //                 onClick={isButton ? () => alert("Button Clicked") : undefined}
    //             >
    //                 {isBackground ? (
    //                     <div style={{ zIndex: 5, position: 'relative', textAlign: 'center' }}>
    //                         <h2 style={{ 
    //                             fontSize: '1.2rem', 
    //                             letterSpacing: '10px', 
    //                             color: '#fff', 
    //                             textShadow: '0 0 20px rgba(255,255,255,0.5)' 
    //                         }}>
    //                             {childrenText}
    //                         </h2>
    //                     </div>
    //                 ) : (
    //                     childrenText
    //                 )}
    //             </Component>
    //         </div>
    //     );
    // };

    // ----> Compile and show the props passes from db
    const DynamicPreview = ({ config }) => {
        // 1. Destructure name and childrenText, 
        // and collect EVERYTHING ELSE into a variable called 'componentProps'
        const { name, childrenText, ...componentProps } = config;
        // 2. Resolve the component from your library
        const Component = CodeVora[name] || name;
        const isBackground = name.toLowerCase().includes("background");
        const isButton = name.toLowerCase() === "button";

        return (
            <div style={{ 
                position: 'relative', 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                overflow: 'hidden',
                background: '#11111116',
                borderRadius: '8px'
            }}>
                <Component 
                    {...componentProps}
                >
                    {isBackground ? (
                        <div style={{ zIndex: 5, position: 'relative', textAlign: 'center' }}>
                            <h2 style={{ 
                                fontSize: '1.2rem', 
                                letterSpacing: '10px', 
                                color: '#fff', 
                                textShadow: '0 0 20px rgba(255,255,255,0.5)' 
                            }}>
                                {childrenText}
                            </h2>
                        </div>
                    ) : (
                        childrenText
                    )}
                </Component>
            </div>
        );
    };



        // handle Share Click LOGIC
    const handleShareClick = (platform) => {
        const realUrl = window.location.href;
        const encodedRealUrl = encodeURIComponent(realUrl);
        const pageTitle = encodeURIComponent(activeComp?.title || document.title);
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



    // -----------------> handle ERROR
    if (error){
        return(
            <h3 style={{color: 'red'}}>ERROR Fetching library npm package data. <br /> Please Try again</h3>
        )
    }




    // ------------------> handle LOADING [skeleton Loader]
    if (loading) {
        const skeletonProps = {
            baseColor: "#1a1a20",
            highlightColor: "#2a2a35",
        };
        return (
            <div className="component-page-container container">
                {/* 1. HEADER SKELETON */}
                <header className='header'>
                    <section className='header-top'>
                        <div style={{ flex: 1 }}>
                            <Skeleton width="80px" height={12} {...skeletonProps} style={{ marginBottom: '10px' }} />
                            <Skeleton className="skeleton-title-main" height={45} {...skeletonProps} />
                        </div>
                        <Skeleton circle width={40} height={40} {...skeletonProps} />
                    </section>
                    <div style={{ marginTop: '20px' }}>
                        <Skeleton count={2} width="100%" {...skeletonProps} />
                        <Skeleton width="60%" {...skeletonProps} />
                    </div>
                </header>

                {/* 2. ACTIONS SKELETON */}
                <section className="lib-action-btns" style={{ opacity: 0.6, border: '1px solid #1a1a1a' }}>
                    <Skeleton width="100px" height={38} borderRadius={8} {...skeletonProps} />
                    <Skeleton width="120px" height={38} borderRadius={8} {...skeletonProps} />
                    <Skeleton width="120px" height={38} borderRadius={8} {...skeletonProps} />
                </section>

                {/* 3. STAGE SKELETON */}
                <section className="hero-visual-stage" style={{ border: '2px solid #1a1a1a' }}>
                    <Skeleton height="100%" width="100%" baseColor="#0a0a0c" highlightColor="#16161e" />
                </section>

                {/* 4. SPECS SKELETON */}
                <section className="content-specs">
                    <div className="specs-grid">
                        {/* Props Table Simulation */}
                        <div className="spec-card">
                            <Skeleton width="100px" height={20} {...skeletonProps} style={{ marginBottom: '15px' }} />
                            <Skeleton height={200} borderRadius={12} {...skeletonProps} />
                        </div>

                        {/* Smaller Code Cards */}
                        <div className="spec-card">
                            <div className="spec-header">
                                <Skeleton width="40%" height={15} {...skeletonProps} />
                                <Skeleton width="60px" height={25} {...skeletonProps} />
                            </div>
                            <Skeleton width="70%" height={10} style={{ margin: '15px 0' }} {...skeletonProps} />
                            <Skeleton height={60} borderRadius={8} baseColor="#000" highlightColor="#1a1a20" />
                        </div>
                    </div>
                </section>
            </div>
        );
    }




    const activeComp = libraryComponents.find(c => c.id === componentId);
    /**
     * Internal Dynamic Renderer
     */
    if (!activeComp) return <div className="error">Component Not Found</div>;


    return (

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

                    {/* Props Table Card */}
                    <div className="spec-card">
                        <div className="spec-header">
                            <h4>PROPS</h4>
                        </div>
                        <p><small>Properties and options for selecting and customizing this component.</small></p>
                        <div className="lib-props-table-wrapper">
                            <table className="lib-props-table">
                                <thead>
                                    <tr>
                                        <th>Prop</th>
                                        <th>Type</th>
                                        <th>Default</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* 1. Dynamic Props from Database with safety check */}
                                    {activeComp.props?.map((prop, index) => (
                                        <tr key={index}>
                                            <td><code>{prop.name}</code></td>
                                            <td><code>{prop.prop_type}</code></td>
                                            <td><code>{prop.default_value}</code></td>
                                            <td>{prop.description}</td>
                                        </tr>
                                    ))}

                                    {/* 2. Static Common Props (Optional: manually add if not in DB) */}
                                    <tr>
                                        <td><code>children</code></td>
                                        <td><code>ReactNode</code></td>
                                        <td><code>null</code></td>
                                        <td>UI elements to be rendered on top of the component.</td>
                                    </tr>
                                    <tr>
                                        <td><code>className</code></td>
                                        <td><code>string</code></td>
                                        <td><code>""</code></td>
                                        <td>Custom CSS classes for the container.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>


                    {/* Installation Card */}
                    <div className="spec-card">
                        <div className="spec-header">
                            <h4>PACKAGE MANAGER</h4>
                            <CopyButton text="npm i codevora-ui" />
                        </div>
                        <p><small>Command to install the core package</small></p>
                        <div className="code-snippet language-jsx"><code style={{color: 'rgb(218 0 255)'}}>npm i codevora-ui</code></div>
                    </div>

                    {/* Import Card */}
                    <div className="spec-card">
                        <div className="spec-header">
                            <h4>IMPORT</h4>
                            <CopyButton text={`import { ${activeComp.config.name} } from "codevora-ui"`} />
                        </div>
                        <p><small>Add this to top of your React file</small></p>
                        <pre className="code-snippet language-jsx">
                            <code style={{color: '#e230e2'}}>{`import { ${activeComp.config.name} } from "codevora-ui"`}</code>
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

    );
};

export default Library_Body;