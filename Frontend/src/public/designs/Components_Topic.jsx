import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Parent_API_Provider_Context } from "../Home/context/Parent_API_Provider.jsx";
import Interactive_Grid_Background from "../Home/context/Interactive_Grid_Background.jsx";
import Ads_Banner_Horizontal from "../Home/context/Ads_Banner_Horizontal.jsx";
import "./assets/css/Components_Topic.css";

const NEW_DURATION_DAYS = 7;

const isNewItem = (date) => {
    if (!date) return false;
    const diffDays = (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
    return diffDays <= NEW_DURATION_DAYS;
};

const Components_Topic = () => {
    const { languageID } = useParams();
    const {
        languages,
        loadingBase,
        topicLoading,
        fetchTopicsForLanguage,
    } = useContext(Parent_API_Provider_Context);

    const [frontendLangs, setFrontendLangs] = useState([]);
    const [activeLangID, setActiveLangID] = useState(() => {
        return localStorage.getItem("lastSelectedLang") || languageID;
    });

    const scrollRef = useRef(null);

    useEffect(() => {
        if (!loadingBase && languages) {
            setFrontendLangs(languages.filter((l) => l.section === 1));
        }
    }, [loadingBase, languages]);

    useEffect(() => {
        const loadTopics = async () => {
            if (!frontendLangs.length) return;
            const activeLang = frontendLangs.find(
                (lang) => String(lang.id) === String(activeLangID)
            );
            if (!activeLang) return;
            if (!activeLang.topics || activeLang.topics.length === 0) {
                await fetchTopicsForLanguage(activeLangID);
            }
        };
        loadTopics();
    }, [activeLangID, frontendLangs, fetchTopicsForLanguage]);

    useEffect(() => {
        if (!frontendLangs.length) return;
        const container = scrollRef.current;
        if (!container) return;

        const selectedCard = document.querySelector(".ct-fs-card.ct-selected-card");
        if (selectedCard) {
            const containerRect = container.getBoundingClientRect();
            const cardRect = selectedCard.getBoundingClientRect();
            const cardLeftWithinContainer = cardRect.left - containerRect.left + container.scrollLeft;
            const targetScrollLeft = Math.round(cardLeftWithinContainer - container.clientWidth / 2 + cardRect.width / 2);
            container.scrollTo({
                left: Math.max(0, Math.min(targetScrollLeft, container.scrollWidth - container.clientWidth)),
                behavior: "smooth",
            });
        }
    }, [activeLangID, frontendLangs]);

    const globalTotalComponents = frontendLangs.reduce((total, lang) => {
        const langCount = lang.topics?.reduce((sum, topic) => sum + (topic.source_codes?.length || 0), 0) || 0;
        return total + langCount;
    }, 0);

    return (
        <Interactive_Grid_Background>
            <div className="ct-tutorial-topic-page container" style={{ 
                minHeight: "100vh", 
                display: "flex", 
                flexDirection: "column" 
            }}>
                <div style={{ flex: "1 0 auto" }}> {/* Main Content Wrapper */}
                    <h1 className="ct-page-title">
                        {loadingBase ? (
                            <Skeleton width={50} />
                        ) : (
                            <span className="ct-total-count"><b>{globalTotalComponents} &nbsp;</b></span>
                        )}
                        Components Design by CodeVora UI
                    </h1>

                    <div className="ct-fs-wrapper">
                        <div className="ct-fs-scroll" ref={scrollRef}>
                            <div className="ct-fs-grid">
                                {loadingBase
                                    ? Array.from({ length: 3 }).map((_, idx) => (
                                        <div key={idx} className="ct-skeleton-lang-card">
                                            <Skeleton circle height={35} width={35} />
                                            <Skeleton width={50} height={12} />
                                        </div>
                                    ))
                                    : frontendLangs.map((lang) => (
                                        <Link
                                            key={lang.id}
                                            to={`/Components/Topics/${lang.id}`}
                                            className={`ct-fs-card ${String(lang.id) === String(activeLangID) ? "ct-selected-card" : ""}`}
                                            onClick={() => {
                                                setActiveLangID(lang.id);
                                                localStorage.setItem("lastSelectedLang", lang.id);
                                            }}
                                        >
                                            {lang.icon_class ? <i className={`${lang.icon_class} ct-fs-card-icon`}></i> : <Skeleton circle height={20} width={20} />}
                                            <span className="ct-fs-card-text">{lang.name || <Skeleton width={50} />}</span>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {loadingBase || topicLoading ? (
                        <div className="ct-topic-grid">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div className="ct-skeleton-topic-card" key={i}>
                                    <div className="ct-skeleton-title"></div>
                                    <div className="ct-skeleton-footer"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        frontendLangs
                            .filter((lang) => String(lang.id) === String(activeLangID))
                            .map((lang) => (
                                <div key={lang.id} className="ct-language-section">
                                    <h2 className="ct-language-title">{lang.name} Collections</h2>
                                    <div className="ct-topic-grid">
                                        {lang.topics?.length > 0 ? (
                                            lang.topics.map((topic) => {
                                                const componentCount = topic.source_codes?.length || 0;
                                                
                                                // UPDATED LOGIC: Check if any internal component is new
                                                const hasNewComponent = topic.source_codes?.some(code => isNewItem(code.created_at));
                                                const showNewBadge = isNewItem(topic.created_at) || hasNewComponent;

                                                const firstSourceId = topic.source_codes?.[0]?.id;
                                                const toPath = firstSourceId ? `/Components/${topic.id}/${firstSourceId}` : `/Components/${topic.id}`;

                                                return (
                                                    <Link key={topic.id} to={toPath} className="ct-topic-card">
                                                        <div className="ct-card-header">
                                                            <h3>{topic.name}</h3>
                                                            {showNewBadge && <span className="ct-badge-new">NEW</span>}
                                                        </div>
                                                        <div className="ct-card-footer">
                                                            <span className="ct-comp-count">
                                                                <i className="bi bi-stack"></i> {componentCount} Components
                                                            </span>
                                                        </div>
                                                    </Link>
                                                );
                                            })
                                        ) : (
                                            <div className="ct-no-topic">
                                                <p>Content will be uploaded very soon...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                    )}
                </div>

                {/* HORIZONTAL BANNER AD AT BOTTOM */}
                    <footer style={{ 
                        flexShrink: 0, 
                        width: "100%", 
                        maxWidth: "1200px", // Prevents the banner from becoming insanely wide on Ultrawide monitors
                        margin: "60px auto 0 auto", 
                        padding: "0 1rem 20px 1rem", // Added side padding for mobile/tablet
                        boxSizing: "border-box" 
                    }}>
                        <Ads_Banner_Horizontal />
                    </footer>
            </div>
        </Interactive_Grid_Background>
    );
};

export default Components_Topic;