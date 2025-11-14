// Parent_API_Provider_Context.jsx
import React, { createContext, useState, useEffect } from "react";

// Create the context
export const Parent_API_Provider_Context = createContext();

// Replace with your actual backend URL
const BASE_URL = "https://sujan140.com.np/api";

export const Parent_Api_Provider = ({ children }) => {
    // Initial empty structure (skeleton)
    const emptyStructure = {
        categories: [
            {
                id: null,
                name: "",
                description: "",
                sections: [
                    {
                        id: null,
                        name: "",
                        languages: [
                            {
                                id: null,
                                name: "",
                                icon_class: "",
                                topics: [
                                    {
                                        id: null,
                                        name: "",
                                        language: null,
                                        section: null,
                                        category: null,
                                        videos: [
                                            {
                                                id: null,
                                                topic: null,
                                                title: "",
                                                video_url: "",
                                                access_type: "",
                                                info: { id: null, video: null, description: "" },
                                                source_codes: [
                                                    {
                                                        id: null,
                                                        video: null,
                                                        html_code: "",
                                                        css_code: "",
                                                        js_code: "",
                                                        access_type: ""
                                                    }
                                                ]
                                            }
                                        ],
                                        images: [
                                            { id: null, image: "", topic: null }
                                        ],
                                        steps: [
                                            {
                                                id: null,
                                                topic: null,
                                                step_number: null,
                                                step_file_name: "",
                                                step_description: "",
                                                step_source_code: ""
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };

    const [data, setData] = useState(emptyStructure);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch parent API
    const fetchParentApi = async () => {
        try {
            const res = await fetch(`${BASE_URL}/categories/`);
            const categories = await res.json();

            // Update state with fetched data
            setData({ categories });
            setLoading(false);
        } catch (err) {
            console.error("Error fetching parent API:", err);
            setError(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParentApi();
    }, []);

    return (
        <Parent_API_Provider_Context.Provider value={{ data, loading, error }}>
            {children}
        </Parent_API_Provider_Context.Provider>
    );
};
