import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/css/Components_Left_Sidebar.css";
import { Parent_API_Provider_Context } from "../context/Parent_API_Provider.jsx";

const NEW_DURATION_DAYS = 7;
const ACTIVE_TOPIC_KEY = "active_component_topic";

const isNewItem = (date) => {
    if (!date) return false;
    const diffDays = (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
    return diffDays <= NEW_DURATION_DAYS;
};

function Components_Left_Sidebar() {
    const { languageID, topicID, languages, loadingBase } = useContext(Parent_API_Provider_Context);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTopic, setActiveTopic] = useState(() => {
        return topicID || localStorage.getItem(ACTIVE_TOPIC_KEY);
    });


    useEffect(() => {
        if (topicID) {
            setActiveTopic(topicID);
            localStorage.setItem(ACTIVE_TOPIC_KEY, topicID);
        }
    }, [topicID]);


    const frontendLangs = languages.filter((l) => l.section === 1);

    const filteredLangs = frontendLangs.map(lang => {
        const matchingTopics = lang.topics?.filter(topic => 
            topic.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];
        const langMatches = lang.name.toLowerCase().includes(searchTerm.toLowerCase());
        if (langMatches || matchingTopics.length > 0) {
            return { ...lang, topics: matchingTopics };
        }
        return null;
    }).filter(Boolean);


    if (loadingBase) {
        return (
            <aside className="cl-sidebar loading">
                <div className="cl-skeleton cl-skeleton-title" style={{margin: '20px'}} />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="cl-lang-block" style={{padding: '0 20px'}}>
                        <div className="cl-skeleton cl-skeleton-lang" />
                        <ul className="cl-topic-list">
                            {[...Array(3)].map((_, j) => (
                                <li key={j}><div className="cl-skeleton cl-skeleton-topic" /></li>
                            ))}
                        </ul>
                    </div>
                ))}
            </aside>
        );
    }

    return (
        <aside className="cl-sidebar">
            <div className="cl-header-sticky">
                <h3 className="cl-title text-center">
                    <i className="bi bi-stack"></i> &nbsp; Components
                </h3>
                <div className="cl-search-wrapper">
                    <i className="bi bi-search cl-search-icon"></i>
                    <input 
                        type="text" 
                        placeholder="Search components..." 
                        className="cl-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="cl-search-clear" onClick={() => setSearchTerm("")}>
                            <i className="bi bi-x"></i>
                        </button>
                    )}
                </div>
            </div>

            <div className="cl-content">
                {filteredLangs.length > 0 ? (
                    filteredLangs.map((lang) => {
                        const isActiveLang = String(lang.id) === String(languageID);

                        return (
                            <div key={lang.id} className="cl-lang-block">
                                <div className={`cl-lang ${isActiveLang ? "active" : ""}`}>
                                    {lang.icon_class && <i className={lang.icon_class}></i>}
                                    <span><b>{lang.name}</b></span>
                                </div>

                                <ul className="cl-topic-list">
                                    {lang.topics.map((topic) => {
                                        const sourceCount = topic.source_codes?.length || 0;
                                        const firstSource = topic.source_codes?.[0];
                                        const toPath = firstSource
                                            ? `/Components/${topic.id}/${firstSource.id}`
                                            : `/Components/${topic.id}`;

                                        // UPDATED LOGIC: Check if ANY source code inside this topic is new
                                        const hasNewComponent = topic.source_codes?.some(code => isNewItem(code.created_at));
                                        const showNewBadge = isNewItem(topic.created_at) || hasNewComponent;
                                        
                                        const isActiveTopic = String(topic.id) === String(activeTopic);

                                        return (
                                            <li key={topic.id}>
                                                <Link
                                                    to={toPath}
                                                    className={`cl-topic ${isActiveTopic ? "active" : ""}`}
                                                    onClick={() => {
                                                        setActiveTopic(topic.id);
                                                        localStorage.setItem(ACTIVE_TOPIC_KEY, topic.id);
                                                    }}
                                                >
                                                    <div className="cl-topic-main">
                                                        <span className="cl-topic-name">{topic.name}</span>
                                                        <span className="cl-topic-count">{sourceCount}</span>
                                                    </div>
                                                    {showNewBadge && <span className="cl-new-badge">NEW</span>}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })
                ) : (
                    <div className="cl-no-results">
                        <i className="bi bi-emoji-frown"></i>
                        <p>No components found for "{searchTerm}"</p>
                    </div>
                )}
                    <hr />
                    <br />
            {/* ==== Footer ==== */}
                <div className="crs-sidebar-footer">
                    <small>&copy; {new Date().getFullYear()} Er.Sujan Rai. All rights reserved.</small>
                </div>
                    <br />
                    <br />

            </div>
        </aside>
    );
}

export default Components_Left_Sidebar;