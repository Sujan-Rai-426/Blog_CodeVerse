import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../assets/css/Tutorial_Topic.css";
import { Parent_API_Provider_Context } from "../context/Parent_API_Provider.jsx";

const Backend_Tutorial_Topic = () => {

    const { languageID } = useParams();
    const { data, loading: parentLoading } = useContext(Parent_API_Provider_Context);

    const [categories, setCategories] = useState([]);       // Filtered backend categories by language
    const [backendLangs, setBackendLangs] = useState([]);   // All backend languages
    const [activeLangID, setActiveLangID] = useState(languageID); // Currently active language in view
    const scrollRef = useRef(null);                         // Ref for horizontal scroll container

  // Fetch all backend languages from parent for horizontal scroll
    useEffect(() => {
        if (!parentLoading && data?.length > 0) {
            const categoriesData = Array.isArray(data) ? data : data.categories || [];
            const tutorialCategory = categoriesData.find(
                (cat) => cat.name?.toLowerCase() === "tutorial"
            );
            if (tutorialCategory) {
                const backendSection = tutorialCategory.sections?.find(
                    (section) => section.name?.toLowerCase() === "backend"
                );
                setBackendLangs(backendSection?.languages || []);
            }
        }
    }, [parentLoading, data]);


  // Filter backend topics per selected language
    useEffect(() => {
        if (!parentLoading && data?.length > 0) {
            const filteredCategories = data
                .map((category) => {
                    const backendSections = category.sections?.filter(
                        (section) => section.name?.toLowerCase() === "backend"
                    );
                    if (backendSections?.length) {
                        const updatedSections = backendSections
                            .map((section) => {
                                const filteredLanguages = section.languages?.filter(
                                    (lang) => String(lang.id) === String(languageID)
                                );
                                return filteredLanguages?.length
                                    ? { ...section, languages: filteredLanguages }
                                    : null;
                            })
                            .filter(Boolean);
                        return updatedSections?.length
                            ? { ...category, sections: updatedSections }
                            : null;
                    }
                    return null;
                })
                .filter(Boolean);
            setCategories(filteredCategories);
        }
    }, [parentLoading, data, languageID]);


  // Scroll to top & center selected language card
    useEffect(() => {
        if (!backendLangs.length || !categories.length) return;
        window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top of page
        // Center selected card in horizontal scroll
        const selectedCard = document.querySelector(".fs-card.selected-card");
        if (selectedCard && scrollRef.current) {
        const container = scrollRef.current;
            const containerRect = container.getBoundingClientRect();
            const cardRect = selectedCard.getBoundingClientRect();
            const offset =
                cardRect.left - containerRect.left - containerRect.width / 2 + cardRect.width / 2;
                container.scrollTo({ left: container.scrollLeft + offset, behavior: "smooth" });
        }
    }, [backendLangs, categories, languageID]);


  // Intersection Observer to highlight active language card
    useEffect(() => {
        if (!categories.length) return;
        const observerOptions = {
            root: null,
            rootMargin: "-150px 0px -50% 0px", // Adjust if navbar is fixed
            threshold: 0,
        };
        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveLangID(entry.target.dataset.langId);
                }
            });
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const sections = document.querySelectorAll(".language-section");
        sections.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [categories]);



    return (
        <div className={`tutorial-topic-page ${parentLoading ? "" : "fade-in"}`}>
            <h1 className="page-title">- Coding Guide -</h1>

        {/* Horizontal Scrollable Backend Languages */}
            <div className="fs-wrapper">
                <div className="fs-scroll" ref={scrollRef}>
                    <div className="fs-grid">
                        {backendLangs.map((lang) => {
                            const isSelected = String(lang.id) === String(languageID);
                            const isActive = String(lang.id) === String(activeLangID);
                            return (
                                <Link
                                    key={lang.id}
                                    to={`/Backend_Tutorial_Topic/${lang.id}`}
                                    className={`fs-card ${isSelected ? "selected-card" : ""} ${isActive ? "active-hover" : ""}`}
                                >
                                    {lang.icon_class && <i className={`${lang.icon_class} fs-card-icon`}></i>}
                                    <span className="fs-card-text">{lang.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

        {/* Backend Topics per Language */}
            {parentLoading ? (
                <div className="topic-grid">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="topic-card">
                            <div className="topic-content">
                                <Skeleton
                                    height={25}
                                    width={`70%`}
                                    baseColor="#2b2b2b"
                                    highlightColor="#3b3b3b"
                                    style={{ margin: "10px auto" }}
                                />
                                <Skeleton count={2} baseColor="#2b2b2b" highlightColor="#3b3b3b" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : categories.length > 0 ? (
                categories.map((category) => (
                    <div key={category.id} className="category-section">
                        {category.sections?.map((section) =>
                            section.languages?.map((language) => (
                                <div key={language.id} className="language-section" data-lang-id={language.id}>
                                    <h2 className="language-title">{language.name}</h2>
                                    <div className="topic-grid">
                                        {language.topics?.length > 0 ? (
                                            language.topics.map((topic) => (
                                                <Link
                                                    key={topic.id}
                                                    to={`/Backend_Tutorial_Solution/${topic.id}`}
                                                    className="topic-card"
                                                >
                                                    <div className="topic-content">
                                                        <h3>{topic.name}</h3>
                                                        <p>Click to view tutorial steps</p>
                                                    </div>
                                                </Link>
                                            ))
                                            ) : (
                                                <p className="no-topic">Content will be uploaded very soon...</p>
                                            )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ))
            ) : (
                <p className="no-topic">No topics found.</p>
            )}
        </div>
    );
};

export default Backend_Tutorial_Topic;
