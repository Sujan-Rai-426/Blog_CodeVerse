import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import "../assets/css/Tutorial_Topic.css";

const Backend_Tutorial_Topic = () => {
    const { languageID } = useParams(); // selected backend language ID
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchBackendCategories = async () => {
            try {
                const res = await api.get("/api/categories/");
                const data = res.data || [];

                const filteredCategories = data
                    .map((category) => {
                        const backendSections = category.sections?.filter(
                            (section) => section.name?.toLowerCase() === "backend"
                        );

                        if (backendSections?.length) {
                            const updatedSections = backendSections.map((section) => {
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

                setCategories(filteredCategories);
                console.log("✅ Filtered backend categories for language:", languageID, filteredCategories);
            } catch (error) {
                console.error("❌ Error fetching backend categories:", error);
            }
        };

        fetchBackendCategories();
    }, [languageID]);

    return (
        <div className="tutorial-topic-page">
            <h1 className="page-title"> 🖥️ <sup><u>Coding Guide</u></sup> </h1>

            {categories.length > 0 ? (
                categories.map((category) => (
                    <div key={category.id} className="category-section">
                        {category.sections?.map((section) =>
                            section.languages?.map((language) => (
                                <div key={language.id}>
                                    <h2 className="language-title">{language.name}</h2>
                                    <div className="topic-grid">
                                        {language.topics?.length > 0 ? (
                                            language.topics.map((topic) => (
                                                <Link key={topic.id} to={`/Backend_Tutorial_Solution/${topic.id}`} className="topic-card">
                                                    <div className="topic-content">
                                                        <h3>{topic.name}</h3>
                                                        <p>Click to view tutorial steps</p>
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <p className="no-topic">No topics found for this language.</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ))
            ) : (
                <p className="loading">Loading backend topics...</p>
            )}
        </div>
    );
};

export default Backend_Tutorial_Topic;
