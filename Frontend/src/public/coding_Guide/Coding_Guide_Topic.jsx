import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useParentAPI } from "../Home/context/Parent_API_Provider.jsx";
import Interactive_Grid_Background from "../Home/context/Interactive_Grid_Background.jsx";
import Ads_Banner_Horizontal from "../Home/context/Ads_Banner_Horizontal.jsx"; 
import "./assets/css/Coding_Guide_Topic.css";

const Coding_Guide_Topic = () => {
  const { languageID } = useParams();
  const { categories: baseCategories, languages: allLanguages, loadingBase } = useParentAPI();

  const [backendLangs, setBackendLangs] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!loadingBase && allLanguages?.length) {
      const backendLanguages = allLanguages.filter(
        (lang) => lang.section === 2 
      );
      setBackendLangs(backendLanguages);
    }
  }, [loadingBase, allLanguages]);

  useEffect(() => {
    if (!backendLangs.length) return;

    const selectedCard = document.querySelector(".fs-card.selected-card");
    if (selectedCard && scrollRef.current) {
      const container = scrollRef.current;
      const containerRect = container.getBoundingClientRect();
      const cardRect = selectedCard.getBoundingClientRect();
      const offset =
        cardRect.left - containerRect.left - containerRect.width / 2 + cardRect.width / 2;
      container.scrollTo({ left: container.scrollLeft + offset, behavior: "smooth" });
    }
  }, [backendLangs, languageID]);

  const selectedLanguage = backendLangs.find(
    (lang) => String(lang.id) === String(languageID)
  );

  if (loadingBase)
    return (
      <div className="topic-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="topic-card">
            <div className="topic-content">
              <Skeleton height={25} width="70%" />
              <Skeleton count={2} />
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <Interactive_Grid_Background>
      <div 
        className="tutorial-topic-page container" 
        style={{ 
          minHeight: "100vh", 
          display: "flex", 
          flexDirection: "column" // Allows footer to be pushed down
        }}
      >
        <div style={{ flex: "1 0 auto" }}> {/* Content Wrapper */}
          <h1 className="page-title">- Coding Guide -</h1>

          <div className="fs-wrapper">
            <div className="fs-scroll" ref={scrollRef}>
              <div className="fs-grid">
                {backendLangs.map((lang) => {
                  const isSelected = String(lang.id) === String(languageID);
                  return (
                    <Link
                      key={lang.id}
                      to={`/Code-Guide/Topic/${lang.id}`}
                      className={`fs-card ${isSelected ? "selected-card" : ""}`}
                    >
                      {lang.icon_class && <i className={`${lang.icon_class} fs-card-icon`}></i>}
                      <span className="fs-card-text">{lang.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {selectedLanguage ? (
            <div className="language-section" data-lang-id={selectedLanguage.id}>
              <h2 className="language-title">{selectedLanguage.name}</h2>
              <div className="topic-grid">
                {selectedLanguage.topics?.length > 0 ? (
                  selectedLanguage.topics.map((topic) => (
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
          ) : (
            <p className="no-topic">Select a language to see its topics...</p>
          )}
        </div>

        {/* 2. PLACEMENT OF X-AXIS BANNER AD */}
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

export default Coding_Guide_Topic;