import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../assets/css/Tutorial_Topic.css";
import { Parent_API_Provider_Context } from "../context/Parent_API_Provider.jsx";

const Backend_Tutorial_Topic = () => {
    const { languageID } = useParams();
    const { data, loading: parentLoading } = useContext(Parent_API_Provider_Context);

    const [categories, setCategories] = useState([]);

  // === Filter backend topics from parent API ===
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
                            .filter(Boolean); // Remove empty sections

                            return updatedSections?.length
                                ? { ...category, sections: updatedSections }
                                : null;
                            }

                        return null;
                    })
                .filter(Boolean); // Remove empty categories

            setCategories(filteredCategories);
        }
    }, [parentLoading, data, languageID]);


    return (
        <div className={`tutorial-topic-page ${parentLoading ? "" : "fade-in"}`}>
            <h1 className="page-title">
                ⚙️ <sup><u>Coding Guide</u></sup>
            </h1>

            {parentLoading ? (
                // === Loading Skeleton ===
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
                // === Render filtered categories and topics ===
                categories.map((category) => (
                    <div key={category.id} className="category-section">
                        {category.sections?.map((section) =>
                            section.languages?.map((language) => (
                                <div key={language.id}>
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