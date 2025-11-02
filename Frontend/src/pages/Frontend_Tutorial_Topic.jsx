import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../assets/css/Tutorial_Topic.css";

const Frontend_Tutorial_Topic = () => {
    const { languageID } = useParams();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFrontendCategories = async () => {
            try {
                const res = await api.get("/api/categories/");
                const data = res.data || [];

                const filteredCategories = data
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

                setCategories(filteredCategories);
            } catch (error) {
                console.error("❌ Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFrontendCategories();
    }, [languageID]);

    return (
        <div className="tutorial-topic-page">
            <h1 className="page-title">
                🎨 <sup><u>Frontend Designs</u></sup>
            </h1>

            {loading ? (
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
            ) : categories.length > 0 ? (
                categories.map((category) => (
                <div key={category.id} className="category-section">
                    {category.sections?.map((section) =>
                        section.languages?.map((language) => (
                            <div key={language.id}>
                                <h2 className="language-title">{language.name}</h2>
                                <div className="topic-grid">
                                    {language.topics?.length > 0 ? (
                                        language.topics.map((topic) => (
                                            <Link key={topic.id} to={`/Frontend_Tutorial_Solution/${topic.id}`} className="topic-card" >
                                                <div className="topic-content">
                                                    <h3>{topic.name}</h3>
                                                    <p>Click to view tutorial steps</p>
                                                </div>
                                            </Link>
                                        ))
                                        ) : (
                                        <p className="no-topic">
                                            Content will be uploaded very soon...
                                        </p>
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

export default Frontend_Tutorial_Topic;
