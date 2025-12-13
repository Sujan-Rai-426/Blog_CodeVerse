import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import "../assets/css/Components_Left_Sidebar.css";
import { Parent_API_Provider_Context } from "../context/Parent_API_Provider.jsx";

const NEW_DURATION_DAYS = 7; // mark as NEW if added within last 7 days

// Check if a date is within the last NEW_DURATION_DAYS
const isNewItem = (date) => {
    if (!date) return false;
    const diffDays = (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
    return diffDays <= NEW_DURATION_DAYS;
};

function Components_Left_Sidebar() {
    const { languageID, topicID } = useParams();
    const { languages, loading } = useContext(Parent_API_Provider_Context);

    if (loading) {
        return (
            <aside className="cl-sidebar">
                <p className="cl-loading">Loading...</p>
            </aside>
        );
    }

    const frontendLangs = languages.filter((l) => l.section === 1);

    return (
        <aside className="cl-sidebar">
            <h3 className="cl-title sticky-top text-center"> <i className="bi bi-easel3-fill"></i> &nbsp; Components</h3>

            {frontendLangs.map((lang) => {
                const isActiveLang = String(lang.id) === String(languageID);

                return (
                    <div key={lang.id} className="cl-lang-block">
                        {/* Language */}
                        <Link
                            to={`/Component-Topics/${lang.id}`}
                            className={`cl-lang ${isActiveLang ? "active" : ""}`}
                        >
                            {lang.icon_class && <i className={lang.icon_class}></i>}
                            <span><b>{lang.name}</b></span>
                        </Link>

                        {/* Topics */}
                        {lang.topics?.length > 0 && (
                            <ul className="cl-topic-list">
                                {lang.topics.map((topic) => {
                                    const isActiveTopic = String(topic.id) === String(topicID);
                                    const firstSource = topic.source_codes?.[0];
                                    const firstSourceCreated = firstSource?.created_at;

                                    const toPath = firstSource
                                        ? `/Components/${topic.id}/${firstSource.id}`
                                        : `/Components/${topic.id}`;

                                    // ✅ NEW badge logic: either topic or first source is new
                                    const showNewBadge =
                                        isNewItem(topic.created_at) || isNewItem(firstSourceCreated);

                                    return (
                                        <li key={topic.id}>
                                            <Link
                                                to={toPath}
                                                className={`cl-topic ${isActiveTopic ? "active" : ""}`}
                                            >
                                                {topic.name}
                                                {showNewBadge && (
                                                    <span className="cl-new-badge">NEW ✨</span>
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
