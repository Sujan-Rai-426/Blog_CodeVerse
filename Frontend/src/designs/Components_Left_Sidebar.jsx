import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import "../assets/css/Components_Left_Sidebar.css";
import { Parent_API_Provider_Context } from "../context/Parent_API_Provider.jsx";

const NEW_DURATION_DAYS = 7;

const isNewItem = (date) => {
    if (!date) return false;
    const diffDays = (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
    return diffDays <= NEW_DURATION_DAYS;
};

function Components_Left_Sidebar() {
    const { languageID, topicID, languages, loadingBase } =
        useContext(Parent_API_Provider_Context);

    const frontendLangs = languages.filter((l) => l.section === 1);


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

    return (
        <aside className="cl-sidebar">
            <h3 className="cl-title sticky-top text-center">
                <i className="bi bi-easel3-fill"></i> &nbsp; Components
            </h3>

            {frontendLangs.map((lang) => {
                const isActiveLang = String(lang.id) === String(languageID);

                return (
                    <div key={lang.id} className="cl-lang-block">
                        <Link
                            to={`/Component-Topics/${lang.id}`}
                            className={`cl-lang ${isActiveLang ? "active" : ""}`}
                        >
                            {lang.icon_class && <i className={lang.icon_class}></i>}
                            <span>
                                <b>{lang.name}</b>
                            </span>
                        </Link>

                        {lang.topics?.length > 0 && (
                            <ul className="cl-topic-list">
                                {lang.topics.map((topic) => {
                                    const isActiveTopic =
                                        String(topic.id) === String(topicID);
                                    const firstSource = topic.source_codes?.[0];
                                    const firstSourceCreated = firstSource?.created_at;

                                    const toPath = firstSource
                                        ? `/Components/${topic.id}/${firstSource.id}`
                                        : `/Components/${topic.id}`;

                                    const showNewBadge =
                                        isNewItem(topic.created_at) ||
                                        isNewItem(firstSourceCreated);

                                    return (
                                        <li key={topic.id}>
                                            <Link
                                                to={toPath}
                                                className={`cl-topic ${
                                                    isActiveTopic ? "active" : ""
                                                }`}
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
