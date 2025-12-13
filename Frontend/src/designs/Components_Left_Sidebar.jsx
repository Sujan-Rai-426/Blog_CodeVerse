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
    const { languageID, topicID, languages, loadingBase } =
        useContext(Parent_API_Provider_Context);

    // 🔥 Restore from cache first
    const [activeTopic, setActiveTopic] = useState(() => {
        return topicID || localStorage.getItem(ACTIVE_TOPIC_KEY);
    });

    // 🔄 Sync with URL changes
    useEffect(() => {
        if (topicID) {
            setActiveTopic(topicID);
            localStorage.setItem(ACTIVE_TOPIC_KEY, topicID);
        }
    }, [topicID]);

    const frontendLangs = languages.filter((l) => l.section === 1);

    // ----------------------------------------------------
    // LOADING SKELETON
    // ----------------------------------------------------
    if (loadingBase) {
        return (
            <aside className="cl-sidebar loading">
                <div className="cl-skeleton cl-skeleton-title" />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="cl-lang-block">
                        <div className="cl-skeleton cl-skeleton-lang" />
                        <ul className="cl-topic-list">
                            {[...Array(3)].map((_, j) => (
                                <li key={j}>
                                    <div className="cl-skeleton cl-skeleton-topic" />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </aside>
        );
    }

    // ----------------------------------------------------
    // SIDEBAR
    // ----------------------------------------------------
    return (
        <aside className="cl-sidebar">
            <h3 className="cl-title sticky-top text-center">
                <i className="bi bi-easel3-fill"></i> &nbsp; Components
            </h3>

            {frontendLangs.map((lang) => {
                const isActiveLang = String(lang.id) === String(languageID);

                return (
                    <div key={lang.id} className="cl-lang-block">
                        <div className={`cl-lang ${isActiveLang ? "active" : ""}`}>
                            {lang.icon_class && <i className={lang.icon_class}></i>}
                            <span><b>{lang.name}</b></span>
                        </div>

                        {lang.topics?.length > 0 && (
                            <ul className="cl-topic-list">
                                {lang.topics.map((topic) => {
                                    const firstSource = topic.source_codes?.[0];
                                    const firstSourceCreated = firstSource?.created_at;

                                    const toPath = firstSource
                                        ? `/Components/${topic.id}/${firstSource.id}`
                                        : `/Components/${topic.id}`;

                                    const showNewBadge =
                                        isNewItem(topic.created_at) ||
                                        isNewItem(firstSourceCreated);

                                    const isActiveTopic =
                                        String(topic.id) === String(activeTopic);

                                    return (
                                        <li key={topic.id}>
                                            <Link
                                                to={toPath}
                                                className={`cl-topic ${isActiveTopic ? "active" : ""}`}
                                                onClick={() => {
                                                    setActiveTopic(topic.id);
                                                    localStorage.setItem(
                                                        ACTIVE_TOPIC_KEY,
                                                        topic.id
                                                    );
                                                }}
                                            >
                                                {topic.name}
                                                {showNewBadge && (
                                                    <span className="cl-new-badge">
                                                        NEW ✨
                                                    </span>
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                );
            })}
        </aside>
    );
}

export default Components_Left_Sidebar;
