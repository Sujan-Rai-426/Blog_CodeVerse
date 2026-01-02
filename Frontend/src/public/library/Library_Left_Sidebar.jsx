import React, { useState, useMemo } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { use_Library_API } from './Library_API_Context';
import "./assets/css/Library_Left_Sidebar.css";

// --- MATCHING LOGIC FROM LIBRARY_TOPIC ---
const NEW_DURATION_DAYS = 15;
const isNewItem = (date) => {
    if (!date) return false;
    const diffDays = (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
    return diffDays <= NEW_DURATION_DAYS;
};

const Library_Left_Sidebar = ({ isOpen, toggleSidebar }) => {
    const { libraryTopics, libraryComponents, loading } = use_Library_API();
    const { topicId } = useParams();
    
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedTopics, setExpandedTopics] = useState({ [topicId]: true });

    const toggleTopic = (id) => {
        setExpandedTopics(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredSidebarData = useMemo(() => {
        const query = searchTerm.toLowerCase();
        
        return libraryTopics
            .filter(topic => topic.id !== "all") 
            .map(topic => {
                const components = libraryComponents.filter(c => 
                    c.topic_id === topic.id && 
                    (c.title.toLowerCase().includes(query) || topic.name.toLowerCase().includes(query))
                );
                return { ...topic, components };
            })
            .filter(topic => topic.components.length > 0);
    }, [searchTerm, libraryTopics, libraryComponents]);

    if (loading) return <div className="lib-sidebar-skeleton">Loading Navigation...</div>;

    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

            <aside className={`lib-left-sidebar ${isOpen ? 'open' : ''}`}>
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

                <nav className="sidebar-nav scrollbar-custom">
                    {filteredSidebarData.length > 0 ? (
                        filteredSidebarData.map((topic) => {
                            const isTopicActive = topicId === topic.id;
                            const isExpanded = searchTerm ? true : expandedTopics[topic.id];

                            return (
                                <div key={topic.id} className={`nav-group ${isTopicActive ? 'active' : ''}`}>
                                    <div className="nav-item-topic" onClick={() => toggleTopic(topic.id)}>
                                        <i className={`${topic.icon_class} topic-icon`}></i>
                                        <span className="topic-name">{topic.name}</span>
                                        <i className={`bi bi-chevron-right arrow ${isExpanded ? 'rotated' : ''}`}></i>
                                    </div>

                                    {isExpanded && (
                                        <div className="nav-sub-items">
                                            {topic.components.map((comp) => (
                                                <NavLink
                                                    key={comp.id}
                                                    to={`/react-library/${topic.id}/${comp.id}`}
                                                    className={({ isActive }) => `sub-item ${isActive ? 'active' : ''}`}
                                                    onClick={() => window.innerWidth < 992 && toggleSidebar()}
                                                >
                                                    <span className="sub-item-dot"></span>
                                                    <span className="sub-item-text">{comp.title}</span>
                                                    
                                                    {/* DYNAMIC NEW BADGE BASED ON DATE */}
                                                    {isNewItem(comp.created_at) && (
                                                        <span className="badge-new">New</span>
                                                    )}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="cl-no-results">No components found</div>
                    )}
                </nav>
            </aside>
        </>
    );
};

export default Library_Left_Sidebar;