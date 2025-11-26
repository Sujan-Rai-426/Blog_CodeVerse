// src/components/Components_Topic.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../assets/css/Tutorial_Topic.css";
import { Parent_API_Provider_Context } from "../context/Parent_API_Provider.jsx";

const Components_Topic = () => {
    const { languageID } = useParams();
    const navigate = useNavigate();
    const { data, loading: parentLoading } = useContext(Parent_API_Provider_Context);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [frontendLangs, setFrontendLangs] = useState([]);
    const [activeLangID, setActiveLangID] = useState(languageID);
    const scrollRef = useRef(null);

  // Fetch all frontend languages separately
    useEffect(() => {
      if (!parentLoading && data) {
        const categories = Array.isArray(data) ? data : data.categories || [];
        const tutorialCategory = categories.find(
          (cat) => cat.name?.toLowerCase() === "tutorial"
        );
        if (tutorialCategory) {
          const frontendSection = tutorialCategory.sections?.find(
            (section) => section.name?.toLowerCase() === "frontend"
          );
          setFrontendLangs(frontendSection?.languages || []);
        }
      }
    }, [parentLoading, data]);

  // Filter categories by selected language
    useEffect(() => {
      if (!parentLoading && data) {
        const categories = Array.isArray(data) ? data : data.categories || [];
        const categoriesWithFrontend = categories
          .map((category) => {
            const frontendSections = category.sections?.filter(
              (section) => section.name?.toLowerCase() === "frontend"
            );
            if (frontendSections?.length) {
              const updatedSections = frontendSections.map((section) => {
                const filteredLanguages = section.languages?.filter(
                  (lang) => String(lang.id) === String(languageID)
                );
                return { ...section, languages: filteredLanguages };
              });
              return { ...category, sections: updatedSections };
            }
            return null;
          })
          .filter(Boolean);
        setFilteredCategories(categoriesWithFrontend);
      }
    }, [parentLoading, data, languageID]);

  // Scroll selected language card to center on initial render
useEffect(() => {
  if (!frontendLangs.length) return;

  let attempts = 0;
  const maxAttempts = 40; // 40 * interval(25ms) = 1000ms max
  const intervalMs = 25;
  const container = scrollRef.current;
  if (!container) return;

  const centerSelectedCard = (selectedCard) => {
    const containerRect = container.getBoundingClientRect();
    const cardRect = selectedCard.getBoundingClientRect();

    const cardLeftWithinContainer = cardRect.left - containerRect.left + container.scrollLeft;

    const targetScrollLeft = Math.round(
      cardLeftWithinContainer - (container.clientWidth / 2) + (cardRect.width / 2)
    );

    const maxScroll = container.scrollWidth - container.clientWidth;
    const finalScroll = Math.max(0, Math.min(targetScrollLeft, maxScroll));

    container.scrollTo({ left: finalScroll, behavior: "smooth" });
  };

  const intervalId = setInterval(() => {
    attempts += 1;
    const selectedCard = document.querySelector(".fs-card.selected-card");

    if (selectedCard && container) {
      centerSelectedCard(selectedCard);
      clearInterval(intervalId);
    } else if (attempts >= maxAttempts) {
      clearInterval(intervalId);
    }
  }, intervalMs);

  return () => clearInterval(intervalId);
}, [frontendLangs, languageID]);

  // Intersection Observer to highlight language currently visible on screen
    useEffect(() => {
      if (!filteredCategories.length) return;
      const observerOptions = {
        root: null,
        rootMargin: "-150px 0px -50% 0px",
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
    }, [filteredCategories]);

    return (
        <div className="tutorial-topic-page">
            <h1 className="page-title">- Components Design -</h1>

            {/* Horizontal Scrollable Frontend Languages */}
            <div className="fs-wrapper">
                <div className="fs-scroll" ref={scrollRef}>
                    <div className="fs-grid">
                        {frontendLangs.map((lang) => {
                            const isSelected = String(lang.id) === String(languageID);
                            const isActive = String(lang.id) === String(activeLangID);

                            return (
                                <Link
                                  key={lang.id}
                                  to={`/Component-Topics/${lang.id}`}
                                  className={`fs-card ${isSelected ? "selected-card" : ""} ${isActive ? "active-hover" : ""}`}
                                >
                                    {lang.icon_class && (
                                        <i className={`${lang.icon_class} fs-card-icon`}></i>
                                    )}
                                    <span className="fs-card-text">{lang.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Frontend Topics Based on Selected Language */}
            {parentLoading ? (
                <div className="topic-grid">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="topic-card">
                            <div className="topic-content">
                                <Skeleton height={25} width={`70%`} baseColor="#2b2b2b" highlightColor="#3b3b3b" style={{ margin: "10px auto" }} />
                                <Skeleton count={1} baseColor="#2b2b2b" highlightColor="#3b3b3b" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                    <div key={category.id} className="category-section">
                        {category.sections?.map((section) =>
                            section.languages?.map((language) => (
                                <div key={language.id} className="language-section" data-lang-id={language.id} >
                                    <h2 className="language-title">{language.name}</h2>
                                    <div className="topic-grid">
                                        {language.topics?.length > 0 ? (
                                            language.topics.map((topic) => {
                                                // compute first source code id (if exists)
                                                const firstSourceId = (topic.source_codes && topic.source_codes[0] && topic.source_codes[0].id) || null;
                                                const toPath = firstSourceId ? `/Component-Designs/${topic.id}/${firstSourceId}` : `/Component-Designs/${topic.id}`;
                                                return (
                                                    <Link
                                                      key={topic.id}
                                                      to={toPath}
                                                      className="topic-card"
                                                    >
                                                        <div className="topic-content">
                                                            <h3>{topic.name}</h3>
                                                            <p>Click to view tutorial steps</p>
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
                ))
            ) : (
                <p className="no-topic">No topics found.</p>
            )}
        </div>
    );
};

export default Components_Topic;
