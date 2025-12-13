import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import "../assets/css/Components_Left_Sidebar.css";
import { Parent_API_Provider_Context } from "../context/Parent_API_Provider.jsx";

/* ===============================
   🆕 NEW TOPIC CONFIG (EDIT HERE)
   =============================== */
const NEW_TOPICS = {
    // topicId : "YYYY-MM-DD"
    12: "2025-01-08",
    18: "2025-01-10",
    25: "2025-01-12",
};

const isNewTopic = (topicId) => {
    const addedDate = NEW_TOPICS[topicId];
    if (!addedDate) return false;

    const diffDays =
        (new Date() - new Date(addedDate)) / (1000 * 60 * 60 * 24);

    return diffDays <= 7;
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

    const frontendLangs = languages.filter(l => l.section === 1);

    return (
        <aside className="cl-sidebar">
            <h3 className="cl-title skicky-top">Components</h3>

            {frontendLangs.map(lang => {
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
                                {lang.topics.map(topic => {
                                    const isActiveTopic =
                                        String(topic.id) === String(topicID);

                                    const firstSourceId =
                                        topic.source_codes?.[0]?.id || null;

                                    const toPath = firstSourceId
                                        ? `/Components/${topic.id}/${firstSourceId}`
                                        : `/Components/${topic.id}`;

                                    return (
                                        <li key={topic.id}>
                                            <Link
                                                to={toPath}
                                                className={`cl-topic ${isActiveTopic ? "active" : ""}`}
                                            >
                                                {topic.name}

                                                {isNewTopic(topic.id) && (
                                                    <span className="cl-new-badge">
                                                        NEW
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
