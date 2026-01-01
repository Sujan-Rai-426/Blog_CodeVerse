import React, { useEffect, useRef, useState } from "react";
import { useTemplates } from "./Template_API.jsx";
import { useNavigate } from "react-router-dom";
import { FaGem } from "react-icons/fa";
import Interactive_Grid_Background from "../Home/context/Interactive_Grid_Background.jsx";
import Ads_Square_Display from "../Home/context/Ads_Square_Display.jsx";
import "./assets/css/Template_Topics.css";

const Template_Topics = () => {
    const navigate = useNavigate();
    const { templates: apiTemplates, loading: apiLoading } = useTemplates();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        access: "All",
        type: "All Category",
        maxPrice: null,
        search: "",
        sort: "newest" // 2. New state for sorting
    });

    useEffect(() => {
        if (apiTemplates && apiTemplates.length > 0) {
            setTemplates(apiTemplates);
        }
        setLoading(apiLoading);
    }, [apiTemplates, apiLoading]);

    const iframeRefs = useRef({});
    const wrapperRefs = useRef({});
    
    const applyScale = () => {
        Object.keys(wrapperRefs.current).forEach((id) => {
            const wrapper = wrapperRefs.current[id];
            const iframe = iframeRefs.current[id];
            if (!wrapper || !iframe) return;
            const wrapperWidth = wrapper.offsetWidth;
            const scale = wrapperWidth / 1366;
            iframe.style.transform = `scale(${scale})`;
        });
    };

    useEffect(() => {
        applyScale();
        window.addEventListener("resize", applyScale);
        return () => window.removeEventListener("resize", applyScale);
    }, [templates]);

    // FILTERING + SORTING LOGIC
    const filteredTemplates = templates
        .filter((t) => {
            const access = typeof t.access_type === "string" ? t.access_type : t.access_type?.name || "Free";
            const type = typeof t.template_type === "string" ? t.template_type : t.template_type?.name || "General";
            const price = t.price || 0;
            const matchAccess = filters.access === "All" || access === filters.access;
            const matchType = filters.type === "All Category" || type === filters.type;
            const matchPrice = filters.maxPrice == null || price <= filters.maxPrice;
            const matchSearch = t.title.toLowerCase().includes(filters.search.toLowerCase());
            return matchAccess && matchType && matchPrice && matchSearch;
        })
        .sort((a, b) => {
            // 2. Sorting Logic (assuming newer items have higher IDs or a created_at field)
            if (filters.sort === "newest") {
                return b.id - a.id; 
            } else {
                return a.id - b.id;
            }
        });

    const accessTypes = ["All", "Free", "Premium"];
    const templateTypes = ["All Category", ...Array.from(new Set(templates.map((t) => typeof t.template_type === "string" ? t.template_type : t.template_type?.name)))];

    return (
        <Interactive_Grid_Background>
            <div id="TEMPLATES" className="template-page" style={{ minHeight: "100vh" }}>
                
                {/* 1. Showing Total Templates Count */}
                <div className="ct-page-title">
                    <span>{filteredTemplates.length}</span>&nbsp; Templates Available
                </div>


                  {/* ************** Filter Button ************ */}
                <div className="tt-template-filters">
                    {/* 1. Search by title   */}
                    <input
                        type="text"
                        placeholder=" 🔍 Search by title..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                    <div className="tt-select-filters">
                        {/* 2. Filter by Oldest / Newest */}
                        <select onChange={(e) => setFilters({ ...filters, sort: e.target.value })} value={filters.sort}>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                        {/* 3. Filter by Free / Premium */}
                        <select onChange={(e) => setFilters({ ...filters, access: e.target.value })} value={filters.access}>
                            {accessTypes.map((a) => <option key={a} value={a}>{a}</option>)}
                        </select>
                        {/* 4. Filter by template type */}
                        <select onChange={(e) => setFilters({ ...filters, type: e.target.value })} value={filters.type}>
                            {templateTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        {/* 5. Enter by Max Price */}
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={filters.maxPrice ?? ""}
                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : null })}
                        />
                    </div>
                </div>


                  {/* ************** Template Grid ************ */}
                <div className="templates-grid">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="tpl-item skeleton">
                                <div className="iframe-wrapper skeleton-box"></div>
                                <div className="tt-tpl-info">
                                    <div className="skeleton-text"></div>
                                    <div className="skeleton-btn"></div>
                                </div>
                            </div>
                        ))
                    ) : filteredTemplates.length === 0 ? (
                        <p>No templates found.</p>
                    ) : (
                        // 3. Logic to inject Advertisement every 5th place
                        filteredTemplates.map((t, index) => {
                            const isAdPosition = (index + 1) % 3 === 0;
                            const access = typeof t.access_type === "string" ? t.access_type : t.access_type?.name || "Free";
                            const title = t.title || "Untitled";

                            return (
                                <React.Fragment key={t.id}>
                                    <div className={`tt-tpl-item ${access === "Premium" ? "premium-template" : ""}`}>
                                        <div className="iframe-wrapper" ref={(el) => (wrapperRefs.current[t.id] = el)} onClick={() => navigate(`/Templates/${t.id}`)}>
                                            {access === "Premium" && (
                                                <div className="tt-tpl-premium-badge">
                                                    <FaGem className="tt-tpl-gem-icon" /> &nbsp; ${t.price}
                                                </div>
                                            )}
                                            <iframe ref={(el) => (iframeRefs.current[t.id] = el)} className="template-cover-iframe" src={t.iframe_url} title={title} />
                                        </div>
                                        <div className="tt-tpl-info" onClick={() => navigate(`/Templates/${t.id}`)}>
                                            <div><strong>{title}</strong></div>
                                            <div className="tt-view-code-btn">View Template →</div>
                                        </div>
                                    </div>
                                    
                                    {/* Every 5th item, show the Ad */}
                                    {isAdPosition && (
                                        <div className="tt-tpl-item ad-container">
                                            <Ads_Square_Display />
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })
                    )}
                </div>
            </div>
        </Interactive_Grid_Background>
    );
};

export default Template_Topics;