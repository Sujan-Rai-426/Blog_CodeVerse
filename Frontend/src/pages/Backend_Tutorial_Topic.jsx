import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import "../assets/css/Tutorial_Topic.css";

const Backend_Tutorial_Topic = () => {
    const { languageID } = useParams(); // selected backend language ID
    const [categories, setCategories] = useState([]);

    // Fetching api category and show topic of tutorial by filtering on the basic of section'Backend' and language ID
    useEffect(() => {
        const fetchBackendCategories = async () => {
            try {
                const res = await api.get("/api/categories/");
                const data = res.data || [];

                // Filter only backend sections and selected language
                const filteredCategories = data
                    .map(category => {
                            const backendSections = category.sections?.filter(
                            section => section.name?.toLowerCase() === "backend"
                        );

                            if (backendSections?.length) {
                            const updatedSections = backendSections.map(section => {
                                const filteredLanguages = section.languages?.filter(
                                lang => String(lang.id) === String(languageID)
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
        <div>
            {categories.length > 0 ? (
                categories.map(category => (
                    <div key={category.id} className="container py-5" style={{ minHeight: "100vh" }}>
                        {category.sections?.map(section =>
                            section.languages?.map(language => (
                                <div key={language.id} className="row">
                                    {language.topics?.length > 0 ? (
                                        language.topics.map(topic => (
                                            <div key={topic.id} className="col-md-6 col-lg-4 mb-3">
                                                <Link to={`/Backend_Tutorial_Solution/${topic.id}`} className="text-decoration-none">
                                                    <div className="card-hoverable text-center h-100" style={{ borderRadius: "15px", overflow: "hidden", background: "#ffffff", border: "2px solid black", transition: "transform 0.3s", cursor: "pointer", }}>
                                                        <div className="card-body" style={{ color: "black" }}>
                                                            <h5 className="card-title fw-bold text-black">{topic.name}</h5>
                                                            <p className="card-text text-black" style={{ fontSize: "0.9rem" }}>
                                                                Click to view tutorial steps
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-muted mt-3">No topics found for this language.</p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                ))
            ) : (
                <p className="text-center mt-5">Loading backend topics...</p>
            )}
        </div>
    );
};

export default Backend_Tutorial_Topic;
