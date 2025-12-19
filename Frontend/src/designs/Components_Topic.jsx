import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../assets/css/Components_Topic.css";
import { Parent_API_Provider_Context } from "../context/Parent_API_Provider.jsx";
import Interactive_Grid_Background from "../context/Interactive_Grid_Background.jsx";

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
        loading: parentLoading,
        fetchTopicsForLanguage
    } = useContext(Parent_API_Provider_Context);

    const [frontendLangs, setFrontendLangs] = useState([]);
    const [activeLangID, setActiveLangID] = useState(() => {
        return localStorage.getItem("lastSelectedLang") || languageID;
    });
    const [loadingTopics, setLoadingTopics] = useState(false);

    const scrollRef = useRef(null);

    // Load frontend languages
    useEffect(() => {
        if (!parentLoading && languages) {
            setFrontendLangs(languages.filter(l => l.section === 1));
        }
    }, [parentLoading, languages]);

    // Lazy-load topics for active language
    useEffect(() => {
        const loadTopics = async () => {
            if (!frontendLangs.length) return;
            const activeLang = frontendLangs.find(lang => String(lang.id) === String(activeLangID));
            if (!activeLang) return;

            if (!activeLang.topics || activeLang.topics.length === 0) {
                setLoadingTopics(true);
                const topics = await fetchTopicsForLanguage(activeLangID);
                setFrontendLangs(prev =>
                    prev.map(lang => lang.id === activeLangID ? { ...lang, topics } : lang)
                );
                setLoadingTopics(false);
            }
        };

        loadTopics();
    }, [activeLangID, frontendLangs, fetchTopicsForLanguage]);

    // Auto-scroll logic for horizontal language bar
    useEffect(() => {
        if (!frontendLangs.length) return;
        const container = scrollRef.current;
        if (!container) return;

        const selectedCard = document.querySelector(".ct-fs-card.ct-selected-card");
        if (selectedCard) {
            const containerRect = container.getBoundingClientRect();
            const cardRect = selectedCard.getBoundingClientRect();
            const cardLeftWithinContainer = cardRect.left - containerRect.left + container.scrollLeft;
            const targetScrollLeft = Math.round(
                cardLeftWithinContainer - (container.clientWidth / 2) + (cardRect.width / 2)
            );
            container.scrollTo({
                left: Math.max(0, Math.min(targetScrollLeft, container.scrollWidth - container.clientWidth)),
                behavior: "smooth"
            });
        }
    }, [activeLangID, frontendLangs]);

    // Calculate global total components
    const globalTotalComponents = frontendLangs.reduce((total, lang) => {
        const langCount = lang.topics?.reduce((sum, topic) => {
            return sum + (topic.source_codes?.length || 0);
        }, 0) || 0;
        return total + langCount;
    }, 0);

    return (
        <Interactive_Grid_Background>
            <div className="ct-tutorial-topic-page container" style={{ minHeight: "100vh"}}>
                
                <h1 className="ct-page-title">
                    {!parentLoading && <span className="ct-total-count"><b>{globalTotalComponents}</b></span>}
                    Components Design by CodeVora UI
                </h1>

                {/* Horizontal Scrollable Frontend Languages */}
                <div className="ct-fs-wrapper">
                    <div className="ct-fs-scroll" ref={scrollRef}>
                        <div className="ct-fs-grid">
                            {parentLoading
                                ? Array.from({ length: 5 }).map((_, idx) => (
                                    <div key={idx} className="ct-fs-card skeleton">
                                        <Skeleton circle height={35} width={35} />
                                        <Skeleton width={50} height={12} />
                                    </div>
                                ))
                                : frontendLangs.map(lang => (
                                    <Link
                                        key={lang.id}
                                        to={`/Components/Topics/${lang.id}`}
                                        className={`ct-fs-card ${String(lang.id) === String(activeLangID) ? "ct-selected-card" : ""}`}
                                        onClick={() => {
                                            setActiveLangID(lang.id);
                                            localStorage.setItem("lastSelectedLang", lang.id);
                                        }}
                                    >
                                        {lang.icon_class && <i className={`${lang.icon_class} ct-fs-card-icon`}></i>}
                                        <span className="ct-fs-card-text">{lang.name}</span>
                                    </Link>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Topic Grid Section */}
                {(parentLoading || loadingTopics) ? (
                    <div className="ct-topic-grid">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="ct-topic-card skeleton">
                                <Skeleton height={20} width="80%" />
                                <Skeleton height={14} width="40%" style={{marginTop: '10px'}} />
                            </div>
                        ))}
                    </div>
                ) : (
                    frontendLangs
                        .filter(lang => String(lang.id) === String(activeLangID))
                        .map(lang => (
                            <div key={lang.id} className="ct-language-section">
                                <h2 className="ct-language-title">{lang.name} Collections</h2>
                                <div className="ct-topic-grid">
                                    {lang.topics?.length > 0 ? (
                                        lang.topics.map(topic => {
                                            const componentCount = topic.source_codes?.length || 0;
                                            const latestComponentDate = topic.source_codes?.[0]?.created_at;
                                            const showNewBadge = isNewItem(topic.created_at) || isNewItem(latestComponentDate);
                                            const firstSourceId = topic.source_codes?.[0]?.id;
                                            const toPath = firstSourceId
                                                ? `/Components/${topic.id}/${firstSourceId}`
                                                : `/Components/${topic.id}`;

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
        </Interactive_Grid_Background>
    );
};

export default Components_Topic;
