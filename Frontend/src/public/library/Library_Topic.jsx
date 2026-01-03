/* Library_Topic.jsx */
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./assets/css/Library_Topic.css";
import Components_Right_Sidebar from "../designs/Components_Right_Sidebar";
import { MatrixBackground } from "codevora-ui";
import { use_Library_API } from "./Library_API_Context";

const NEW_DURATION_DAYS = 15;
const isNewItem = (date) => {
    if (!date) return false;
    const diffDays = (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
    return diffDays <= NEW_DURATION_DAYS;
};

const Library_Topic = () => {

    const { libraryTopics, libraryComponents, loading, error } = use_Library_API();
    
    const [activeTopicId, setActiveTopicId] = useState("all");
    const [sortBy, setSortBy] = useState("latest"); 
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const scrollRef = useRef(null);


    const hasNewInTopic = (topicId) => {
        if (topicId === "all") return libraryComponents.some(c => isNewItem(c.created_at));
        return libraryComponents.some(c => c.topic_id === topicId && isNewItem(c.created_at));
    };


    const checkForScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 5);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeout(checkForScroll, 100);
        }, 800);
        window.addEventListener("resize", checkForScroll);
        return () => window.removeEventListener("resize", checkForScroll);
    }, []);

    const getProcessedComponents = () => {
        let items = [...libraryComponents];
        if (activeTopicId !== "all") {
            items = items.filter(c => c.topic_id === activeTopicId);
        }
        if (sortBy === "new") {
            items = items.filter(c => isNewItem(c.created_at));
        } else if (sortBy === "latest") {
            items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sortBy === "oldest") {
            items.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }
        return items;
    };

    const filteredComponents = getProcessedComponents();
    const activeTopicsName = libraryTopics.find(t => t.id === activeTopicId)?.name || "Library";


    if(error){
        return(
            error
        )
    }


    // -------------->  SKELETON LOADER FUNCTION
    const CardSkeleton = () => {
        return (
            <div className="cv-module-card" style={{ pointerEvents: 'none', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div className="cv-module-inner">
                    <div className="cv-module-top">
                        <Skeleton width={80} height={12} baseColor="#1a1a20" highlightColor="#2a2a35" />
                        <Skeleton width={40} height={12} baseColor="#1a1a20" highlightColor="#2a2a35" />
                    </div>

                    <div className="cv-module-main">
                        <Skeleton circle width={45} height={45} baseColor="#1a1a20" highlightColor="#2a2a35" />
                        <div className="cv-module-info" style={{ flex: 1 }}>
                            <Skeleton width="70%" height={18} baseColor="#1a1a20" highlightColor="#2a2a35" />
                            <Skeleton width="40%" height={12} style={{ marginTop: '8px' }} baseColor="#1a1a20" highlightColor="#2a2a35" />
                        </div>
                    </div>

                    <div className="cv-module-footer">
                        <div style={{ flex: 1 }}>
                            <Skeleton height={38} borderRadius={4} baseColor="#000" highlightColor="#1a1a20" />
                        </div>
                        <Skeleton width={40} height={38} borderRadius={4} baseColor="#1a1a20" highlightColor="#2a2a35" />
                    </div>
                </div>
            </div>
        );
    };


    return (
        <MatrixBackground>
            <div className="lib-topic-page">
                <main className="main-library-topic container">
                    <header className="ct-header-section">
                        <h1 className="ct-page-title">
                            <span className="ct-total-count"><b>{loading? "" : (libraryComponents.length)} &nbsp;</b></span>
                            React Components by CodeVora UI Library
                        </h1>
                    </header>


            {/* ---------------------------------------------------------------------------------------
                        1. SLIDABLE NAVIGATION  --> [TOPIC_ID + NEW]
            ---------------------------------------------------------------------------------------- */}
                    <div className={`ct-fs-wrapper ${canScrollLeft ? "is-scrollable-left" : ""} ${canScrollRight ? "is-scrollable-right" : ""}`}>
                        <div className="ct-fs-scroll" ref={scrollRef} onScroll={checkForScroll}>
                            <div className="ct-fs-grid">
                                {libraryTopics.map((cat) => (
                                    <button
                                        key={cat.id}
                                        className={`ct-fs-card ${activeTopicId === cat.id ? "ct-selected-card" : ""}`}
                                        onClick={() => setActiveTopicId(cat.id)}
                                    >
                                        <i className={`${cat.icon_class} ct-fs-card-icon`}></i>
                                        <span className="ct-fs-card-text">{cat.name}</span>
                                        {hasNewInTopic(cat.id) && (
                                            <span className="cv-pill-new-dot">NEW</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>


            {/* ---------------------------------------------------------------------------------------
                    1.2.  HEADER ---> [Collections + Items No. + FILTER(new, latest, oldest)] 
            ---------------------------------------------------------------------------------------- */}
                    <div className="ct-language-section">
                        <div className="ct-section-header">
                            <h2 className="ct-language-title">{activeTopicsName} Collections</h2>
                            <div style={{width:"100%" ,display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                <span className="ct-results-count text-info">
                                    <strong>{loading? "" : (filteredComponents.length)}</strong> items
                                </span>
                                <div className="cv-sort-group">
                                    <button className={sortBy === 'new' ? 'active' : ''} onClick={() => setSortBy('new')}>New</button>
                                    <button className={sortBy === 'latest' ? 'active' : ''} onClick={() => setSortBy('latest')}>Latest</button>
                                    <button className={sortBy === 'oldest' ? 'active' : ''} onClick={() => setSortBy('oldest')}>Oldest</button>
                                </div>
                            </div>
                        </div>


            {/* ---------------------------------------------------------------------------------------
                        2. COMPONENT GRID  --> [SKELETON BODY + COMPONENTS]
            ---------------------------------------------------------------------------------------- */}
                        <div className="ct-topic-grid">
                        {loading ? 
                            (
                                // Render 6 skeletons to fill the grid during load
                                Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)                            
                            ) : filteredComponents.length > 0 ? (
                                    filteredComponents.map((component) => {
                                        const topicInfo = libraryTopics.find(t => t.id === component.topic_id);
                                        return (
                                            <Link key={component.id} to={`/react-library/${component.topic_id}/${component.id}`} className="cv-module-card">
                                                <div className="cv-scan-line"></div>
                                                <div className="cv-module-inner">
                                                    <div className="cv-module-top">
                                                        <div className="cv-id-badge">
                                                            <span className="cv-hex-dot"></span>
                                                            {component.id.toUpperCase()}
                                                        </div>
                                                        {isNewItem(component.created_at) && <div className="cv-pulse-tag">NEW</div>}
                                                    </div>
                                                    <div className="cv-module-main">
                                                        <div className="cv-module-icon"><i className={topicInfo?.icon_class}></i></div>
                                                        <div className="cv-module-info">
                                                            <h3 className="cv-module-title">{component.title}</h3>
                                                            <p className="cv-module-subtitle">{component.short_title_info}</p>
                                                        </div>
                                                    </div>
                                                    {/* <div className="cv-module-footer">
                                                        <div className="cv-terminal-box">
                                                            <span className="cv-prompt">$</span>
                                                            <span style={{color:"#ff5500"}}>
                                                                {"<"}<code style={{color:"#007bff"}}>{component.config.name}</code>
                                                                {" />"}
                                                            </span>
                                                        </div>
                                                        <button className="cv-explore-btn"><i className="bi bi-cpu"></i></button>
                                                    </div> */}
                                                </div>
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <div className="ct-no-topic">
                                        <i className="bi bi-search"></i>
                                        <p>No results found for this filter.</p>
                                    </div>
                                )}
                        </div>
                    </div>
                </main>


                {/* ------------------------
                        3. RIGHT SIDEBAR
                ------------------------- */}
                <aside className="lib-tp-right-sidebar">
                    <Components_Right_Sidebar />
                </aside>
            </div>
        </MatrixBackground>
    );
};

export default Library_Topic;