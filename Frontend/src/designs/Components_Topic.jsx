import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../assets/css/Tutorial_Topic.css";
import { Parent_API_Provider_Context } from "../context/Parent_API_Provider.jsx";

const Components_Topic = () => {
    const { languageID } = useParams();
    const { languages, loading: parentLoading } = useContext(Parent_API_Provider_Context);
    const [frontendLangs, setFrontendLangs] = useState([]);
    
    // Initialize activeLangID from localStorage or languageID
    const [activeLangID, setActiveLangID] = useState(() => {
        return localStorage.getItem("lastSelectedLang") || languageID;
    });

    const scrollRef = useRef(null);

    // Update frontend languages
    useEffect(() => {
        if (!parentLoading && languages) {
            setFrontendLangs(languages.filter(l => l.section === 1));
        }
    }, [parentLoading, languages]);

    // Scroll selected card to center on first render
    useEffect(() => {
        if (!frontendLangs.length) return;
        const container = scrollRef.current;
        if (!container) return;

        const selectedCard = document.querySelector(".fs-card.selected-card");
        if (selectedCard) {
            const containerRect = container.getBoundingClientRect();
            const cardRect = selectedCard.getBoundingClientRect();
            const cardLeftWithinContainer = cardRect.left - containerRect.left + container.scrollLeft;
            const targetScrollLeft = Math.round(
                cardLeftWithinContainer - (container.clientWidth / 2) + (cardRect.width / 2)
            );
            container.scrollTo({ left: Math.max(0, Math.min(targetScrollLeft, container.scrollWidth - container.clientWidth)), behavior: "smooth" });
        }
    }, [frontendLangs]);

    // Intersection Observer (optional, can still update activeLangID)
    useEffect(() => {
        if (!frontendLangs.length) return;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveLangID(entry.target.dataset.langId);
                    localStorage.setItem("lastSelectedLang", entry.target.dataset.langId);
                }
            });
        }, { root: null, rootMargin: "-150px 0px -50% 0px", threshold: 0 });
        const sections = document.querySelectorAll(".language-section");
        sections.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [frontendLangs]);

    return (
        <div className="tutorial-topic-page container" style={{ minHeight: "100vh"}}>
            <h1 className="page-title">- Components Design -</h1>

            {/* Horizontal Scrollable Frontend Languages */}
            <div className="fs-wrapper">
                <div className="fs-scroll" ref={scrollRef}>
                    <div className="fs-grid">
                        {parentLoading
                            ? Array.from({ length: 5 }).map((_, idx) => (
                                <div key={idx} className="fs-card">
                                    <Skeleton height={40} width={40} style={{ marginBottom: 8, borderRadius: "10px" }} />
                                    <Skeleton width={60} />
                                </div>
                            ))
                            : frontendLangs.map(lang => {
                                const isActive = String(lang.id) === String(activeLangID);
                                return (
                                    <Link
                                        key={lang.id}
                                        to={`/Components/Topics/${lang.id}`}
                                        className={`fs-card ${isActive ? "selected-card active-hover" : ""}`}
                                        onClick={() => {
                                            setActiveLangID(lang.id);
                                            localStorage.setItem("lastSelectedLang", lang.id);
                                        }}
                                    >
                                        {lang.icon_class && <i className={`${lang.icon_class} fs-card-icon`}></i>}
                                        <span className="fs-card-text">{lang.name}</span>
                                    </Link>
                                );
                            })}
                    </div>
                </div>
            </div>

            {/* Render topics of active language */}
            {parentLoading ? (
                <div className="topic-grid">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="topic-card">
                            <div className="topic-content">
                                <Skeleton height={25} width={`70%`} style={{ margin: "10px auto" }} />
                                <Skeleton count={1} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                frontendLangs
                    .filter(lang => String(lang.id) === String(activeLangID))
                    .map(lang => (
                        <div key={lang.id} className="language-section" data-lang-id={lang.id}>
                            <h2 className="language-title">{lang.name}</h2>
                            <div className="topic-grid">
                                {lang.topics && lang.topics.length > 0 ? (
                                    lang.topics.map(topic => {
                                        const firstSourceId = topic.source_codes?.[0]?.id || null;
                                        const toPath = firstSourceId
                                            ? `/Components/${topic.id}/${firstSourceId}`
                                            : `/Components/${topic.id}`;
                                        return (
                                            <Link key={topic.id} to={toPath} className="topic-card">
                                                <div className="topic-content">
                                                    <h3>{topic.name}</h3>
                                                </div>
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <p className="no-topic">Content will be uploaded very soon...</p>
                                )}
                            </div>
                        </div>
                    ))
            )}
        </div>
    );
};

export default Components_Topic;
