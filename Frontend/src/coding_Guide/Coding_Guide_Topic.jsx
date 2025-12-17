import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../assets/css/Coding_Guide_Topic.css";
import { useParentAPI } from "../context/Parent_API_Provider.jsx";
import Interactive_Grid_Background from "../context/Interactive_Grid_Background.jsx";
// import { Helmet } from "react-helmet-async";

const Coding_Guide_Topic = () => {
  const { languageID } = useParams();
  const { categories: baseCategories, loadingBase } = useParentAPI();

  const [categories, setCategories] = useState([]);       // Filtered categories
  const [backendLangs, setBackendLangs] = useState([]);   // Backend languages for horizontal scroll
  const [activeLangID, setActiveLangID] = useState(languageID);
  const scrollRef = useRef(null);

  // ------------------------------ FILTER BACKEND LANGUAGES ------------------------------
  useEffect(() => {
    if (!loadingBase && baseCategories?.length) {
      const tutorialCategory = baseCategories.find(
        (cat) => cat.name?.toLowerCase() === "tutorial"
      );

      if (tutorialCategory) {
        const backendSection = tutorialCategory.sections?.find(
          (section) => section.name?.toLowerCase() === "backend"
        );
        setBackendLangs(backendSection?.languages || []);
      }
    }
  }, [loadingBase, baseCategories]);

  // ------------------------------ FILTER TOPICS PER LANGUAGE ------------------------------
  useEffect(() => {
    if (!loadingBase && baseCategories?.length) {
      const filtered = baseCategories
        .map((cat) => {
          const backendSections = cat.sections?.filter(
            (s) => s.name?.toLowerCase() === "backend"
          );
          if (!backendSections?.length) return null;

          const updatedSections = backendSections
            .map((section) => {
              const langs = section.languages?.filter(
                (lang) => String(lang.id) === String(languageID)
              );
              return langs?.length ? { ...section, languages: langs } : null;
            })
            .filter(Boolean);

          return updatedSections?.length ? { ...cat, sections: updatedSections } : null;
        })
        .filter(Boolean);

      setCategories(filtered);
    }
  }, [loadingBase, baseCategories, languageID]);

  // ------------------------------ SCROLL TO SELECTED CARD ------------------------------
  useEffect(() => {
    if (!backendLangs.length || !categories.length) return;

    window.scrollTo({ top: 0, behavior: "smooth" });

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

  // ------------------------------ INTERSECTION OBSERVER FOR ACTIVE LANG ------------------------------
  useEffect(() => {
    if (!categories.length) return;

    const observerOptions = {
      root: null,
      rootMargin: "-150px 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveLangID(entry.target.dataset.langId);
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = document.querySelectorAll(".language-section");
    sections.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [categories]);

  // ------------------------------ RENDER ------------------------------
  if (loadingBase)
    return (
      <div className="topic-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="topic-card">
            <div className="topic-content">
              <Skeleton height={25} width="70%" baseColor="#2b2b2b" highlightColor="#3b3b3b" style={{ margin: "10px auto" }} />
              <Skeleton count={2} baseColor="#2b2b2b" highlightColor="#3b3b3b" />
            </div>
          </div>
        ))}
      </div>
    );

  return (

    <Interactive_Grid_Background>
    
        {/* =================== ============== ====================== */}
        {/* =================== Auto AMP ADS ====================== */}
        {/* =================== ============== ====================== */}
    
        {/* <Helmet>
            <script 
              async 
              custom-element="amp-auto-ads"
              src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"
            />
        </Helmet> */}



        {/* =================== ==================== ====================== */}
        {/* =================== Code Guide Container ====================== */}
        {/* =================== ==================== ====================== */}

        <div className={`tutorial-topic-page fade-in container`} style={{ minHeight: "100vh" }}>
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
                      to={`/Code-Guide/Topic/${lang.id}`}
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
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="category-section">
                {category.sections?.map((section) =>
                  section.languages?.map((language) => (
                    <div key={language.id} className="language-section" data-lang-id={language.id}>
                      <h2 className="language-title">{language.name}</h2>
                      <div className="topic-grid">
                        {language.topics?.length > 0 ? (
                          language.topics.map((topic) => (
                            <Link key={topic.id} to={`/Code-Guide/${topic.id}`} className="topic-card">
                              <div className="topic-content">
                                <h3>{topic.name}</h3>
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

    
    </Interactive_Grid_Background>

);
};

export default Coding_Guide_Topic;
