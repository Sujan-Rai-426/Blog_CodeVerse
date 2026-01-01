// src/components/Components_Design.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { FaFacebook, FaFacebookMessenger, FaGem, FaPlay, FaTelegram, FaWhatsapp } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { Parent_API_Provider_Context } from "../Home/context/Parent_API_Provider.jsx";
import Design_Code from "./Design_code.jsx";
import Design_Preview from "./Design_Preview.jsx";
import { addFavorite } from "../../clients/User_API.jsx";
import User_API_Context from "../../clients/User_API_Context.jsx"
import Ads_Square_Display from "../Home/context/Ads_Square_Display.jsx";
import "./assets/css/Components_Design.css";


// --- NEW Badge Helper ---
const NEW_DURATION_DAYS = 7; //NEW badge is shown for 7 days from uploaded
const isNewItem = (date) => {
    if (!date) return false;
    const diffDays = (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
    return diffDays <= NEW_DURATION_DAYS;
};

// === Main frame iframe doc ===
const buildMainIframeDoc = (html = "", css = "", js = "") => {
    const trimmedJs = (js || "").toString().trim();
    const safeJs = trimmedJs ? trimmedJs.replace(/<\/script>/gi, "<\\/script>") : "";
    const scriptTag = safeJs
        ? `<script>try{${safeJs}}catch(err){console.error("Preview JS error:",err);}</script>`
        : "";
    return `<!doctype html>
    <html lang="en">
    <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <style>
            html,body{
                margin:0;
                padding:0;
                width:100%;
                min-height:100%;
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-items:center;
                background: transparent;
            } 
            ${css || ""}
        </style>
    </head>
    <body>
        ${html || ""}
        <scripts>
            ${scriptTag}
        </scripts>
    </body>
    </html>`;
};

// === Recommended / small frame iframe doc ===
const buildRecommendedIframeDoc = (html = "", css = "", js = "", aspectWidth=1333, aspectHeight = 600) => {
    const trimmedJs = (js || "").toString().trim();
    const safeJs = trimmedJs ? trimmedJs.replace(/<\/script>/gi, "<\\/script>") : "";
    return `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: black;
          overflow: hidden;
        }
        .scaleWrapper {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          position: relative;
        }
        .scaleInner {
          width: ${aspectWidth}px;
          height: ${aspectHeight}px;
          display: flex;
          justify-content: center;
          align-items: center;
          transform-origin: center center;
          position: absolute;
        }
        ${css || ""}
      </style>
    </head>
    <body>
      <div class="scaleWrapper">
        <div class="scaleInner" id="scaleInner">
          ${html || ""}
        </div>
      </div>
      <script>
        try {
          ${safeJs}
        } catch(err) {
          console.error("Preview JS error:", err);
        }
        function resizeScale() {
          const inner = document.getElementById("scaleInner");
          if (!inner) return;
          const naturalWidth = inner.offsetWidth;
          const naturalHeight = inner.offsetHeight;
          const scale = Math.min(
            window.innerWidth / naturalWidth,
            window.innerHeight / naturalHeight
          );
          inner.style.transform = 'scale(' + scale + ')';
        }
        window.addEventListener('load', resizeScale);
        window.addEventListener('resize', resizeScale);
      </script>
    </body>
    </html>`;
};

const deviceSizes = {
    desktop: { width: "100%", height: "600px" },
    tablet: { width: "771px", height: "600px" },
    mobile: { width: "568px", height: "667px" },
};

export default function Components_Design() {
    const { topicID, codeId } = useParams();
    const navigate = useNavigate();
    const { fetchFrontendSourceCode } = useContext(Parent_API_Provider_Context);
    const [currentCodes, setCurrentCodes] = useState(null);
    const [srcDoc, setSrcDoc] = useState("");
    const [relatedItems, setRelatedItems] = useState([]);
    const [activeTab, setActiveTab] = useState("preview");
    const previewRef = useRef(null);
    const codeRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    
    // ------------------- Fetch codes with caching -------------------
    useEffect(() => {
        if (!topicID) return;
        const loadCodes = async () => {
            const cachedKey = `topicCodes_${topicID}`;
            let codes = [];
            const cachedData = localStorage.getItem(cachedKey);
            if (cachedData) {
                try {
                    codes = JSON.parse(cachedData);
                } catch (err) {
                    console.error("Cache parse error:", err);
                }
            }
            if (!codes.length) {
                codes = await fetchFrontendSourceCode(topicID);
                localStorage.setItem(cachedKey, JSON.stringify(codes));
            }
            setRelatedItems(codes);
            let chosenSource = codeId ? codes.find((s) => String(s.id) === String(codeId)) : null;
            if (!chosenSource && codes.length > 0) chosenSource = codes[0];
            if (!chosenSource) {
                setCurrentCodes(null);
                return;
            }
            setCurrentCodes({
                html: chosenSource.html_code || "",
                css: chosenSource.css_code || "",
                js: chosenSource.js_code || "",
                title: chosenSource.title || "Untitled",
                access_type: chosenSource.access_type || "Free",
                price: chosenSource.price || 0,
                hasBought: !!chosenSource.hasBought,
                id: chosenSource.id,
                topicId: topicID,
                description: chosenSource.description || "",
                created_at: chosenSource.created_at, // Ensure we have the date
            });
        };
        loadCodes();
    }, [topicID, codeId, fetchFrontendSourceCode]);
    
    useEffect(() => {
        if (!currentCodes) return;
        setSrcDoc("");
        const timer = setTimeout(() => {
            setSrcDoc(buildMainIframeDoc(currentCodes.html, currentCodes.css, currentCodes.js));
        }, 100);
        return () => clearTimeout(timer);
    }, [currentCodes]);

    const [device, setDevice] = useState("desktop");
    const changeDevice = (label) => {
        if (deviceSizes[label]) {
            setDevice(label);
        }
    };

    const { profile, favorites } = useContext(User_API_Context);
    const [favoriteIds, setFavoriteIds] = useState([]); 
    const [favoriteCountMap, setFavoriteCountMap] = useState({}); 
    const isFavorite = (id) => favoriteIds.includes(id);
    
    useEffect(() => {
        if (favorites && favorites.length) {
            const ids = favorites.map(f => f.code_detail.id);
            setFavoriteIds(ids);
        } else {
            setFavoriteIds([]);
        }
    }, [favorites]);
    
    useEffect(() => {
        const fetchCounts = async () => {
            const allCodes = [currentCodes, ...relatedItems].filter(Boolean);
            const newCounts = {};
            await Promise.all(allCodes.map(async (item) => {
                if (!item?.id) return;
                try {
                    const res = await fetch(`/api/favorite-count/${item.id}/`);
                    if (!res.ok) throw new Error("Failed to fetch");
                    const data = await res.json();
                    newCounts[item.id] = data.favorite_count ?? 0;
                } catch (err) {
                    newCounts[item.id] = 0;
                }
            }));
            setFavoriteCountMap(newCounts);
        };
        if (currentCodes) fetchCounts();
    }, [currentCodes, relatedItems]);

    // handle Favourite LOGIC
    const handleFavorite = async (id) => {
        if (!profile) return alert("Login to add favorites!");
        const isFav = favoriteIds.includes(id);
        setFavoriteIds(prev => isFav ? prev.filter(x => x !== id) : [...prev, id]);
        setFavoriteCountMap(prev => ({
            ...prev,
            [id]: isFav ? Math.max((prev[id] || 1) - 1, 0) : (prev[id] || 0) + 1
        }));
        try {
            const res = await addFavorite(id);
            if (!res.ok) {
                setFavoriteIds(prev => isFav ? [...prev, id] : prev.filter(x => x !== id));
                setFavoriteCountMap(prev => ({
                    ...prev,
                    [id]: isFav ? (prev[id] || 0) + 1 : Math.max((prev[id] || 1) - 1, 0)
                }));
            }
        } catch (err) {
            console.error(err);
            setFavoriteIds(prev => isFav ? [...prev, id] : prev.filter(x => x !== id));
            setFavoriteCountMap(prev => ({
                ...prev,
                [id]: isFav ? (prev[id] || 0) + 1 : Math.max((prev[id] || 1) - 1, 0)
            }));
        }
    };

    // handle Share Click LOGIC
    const handleShareClick = (platform) => {
        const realUrl = window.location.href;
        const encodedRealUrl = encodeURIComponent(realUrl);
        const pageTitle = encodeURIComponent(currentCodes.title || document.title);
        let shareUrl = "";
        switch (platform) {
            case "Messenger":
                shareUrl = `https://www.facebook.com/dialog/send?link=${encodedRealUrl}&app_id=1949440582581236&redirect_uri=${encodedRealUrl}`;
                break;
            case "WhatsApp":
                shareUrl = `https://wa.me/?text=${pageTitle}%20${encodedRealUrl}`;
                break;
            case "Facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedRealUrl}`;
                break;
            case "Telegram":
                shareUrl = `https://t.me/share/url?url=${encodedRealUrl}&text=${pageTitle}`;
                break;
            default:
                navigator.clipboard.writeText(realUrl);
                alert("Link copied!");
                return;
        }
        window.open(shareUrl, "_blank", "width=600,height=500");
    };

    // scrollToSection logic
    const scrollToSection = (tab) => {
        setActiveTab(tab);
        if (tab === "preview") previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        else codeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // openFullscreen logic handle
    const openFullscreen = () => {
        const newWindow = window.open("", "_blank");
        if (!newWindow) return;
        newWindow.document.open();
        newWindow.document.write(srcDoc);
        newWindow.document.close();
    };

    // handle Related / Recommended Click button
    const handleRelatedClick = (code) => {
        navigate(`/Components/${topicID}/${code.id}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Skeleton LOADER
    if (!currentCodes) {
        return (
            <div className="template-preview-container container mx-1" style={{ minHeight: "100vh" }}>
                <div className="template-preview">
                    <div className="preview-header">
                        <div className="cd-header">
                            <div className="cd-skeleton cd-skeleton-title" />
                            <div className="cd-skeleton cd-skeleton-desc" />
                            <div className="cd-skeleton cd-skeleton-badge" />
                        </div>
                        <div className="header-actions">
                            <div className="cd-skeleton cd-skeleton-btn" />
                            <div className="cd-skeleton cd-skeleton-btn" />
                        </div>
                    </div>
                    <div className="navigator-btns">
                        <div className="code-preview-open">
                            <div className="cd-skeleton cd-skeleton-nav-btn" />
                            <div className="cd-skeleton cd-skeleton-nav-btn" />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <div className="cd-skeleton cd-skeleton-nav-btn" />
                            <div className="cd-skeleton cd-skeleton-nav-btn" />
                        </div>
                    </div>
                    <div className="cd-skeleton cd-skeleton-iframe" />
                    <div className="related-topic-container">
                        <div className="cd-skeleton cd-skeleton-section-title" />
                        <div className="cd-search-bar-wrapper">
                            <div className="cd-skeleton cd-skeleton-search" />
                        </div>
                        <div className="cd-filter-btns-wrapper">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="cd-skeleton cd-skeleton-filter-btn" />
                            ))}
                        </div>
                        <div className="related-videos-grid">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="related-video-item">
                                    <div className="cd-skeleton cd-skeleton-iframe" style={{ height: 180 }} />
                                    <div className="cd-skeleton cd-skeleton-video-title" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Filtering Logic
    const filteredRelatedItems = relatedItems
        .filter((s) => s.id !== currentCodes.id)
        .filter((s) => s.topic === Number(topicID))
        .filter((s) => {
            if (!searchTerm) return true;
            return (s.title || "").toLowerCase().includes(searchTerm.toLowerCase());
        })
        .filter((s) => {
            if (activeFilter === "all") return true;
            if (activeFilter === "free") return s.access_type === "Free";
            if (activeFilter === "premium") return s.access_type === "Premium";
            return true;
        })
        .sort((a, b) => {
            if (activeFilter === "latest") return b.id - a.id;
            if (activeFilter === "oldest") return a.id - b.id;
            if (activeFilter === "favorite") return (favoriteCountMap[b.id] || 0) - (favoriteCountMap[a.id] || 0);
            return 0;
        });

    return (
        <div className="cd-template-preview-container container" style={{ minHeight: "100vh" }}>


        {/* ***************************************************************** */}
            {/*                  MAIN CONTENE SECTION                     */}
        {/* ***************************************************************** */}
            <div className="cd-preview-container">

                {/* -------- header Fields [ TITLE, DESCRIPTION, ACCESS TYPE, PRICE, FAVOURITE, SHARE ------- ] */}
                <div className="preview-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    
                    {/* ------- TOP LEFT FIELDS ---> [ Title, Description, Access Type, Price ] --------- */}
                    <div className="cd-header">
                        <h3 className="text-infro">{currentCodes.title}</h3>
                        <p>{currentCodes.description}</p>
                        <div className="access-info" style={{ marginTop: 6 }}>
                            <span className={`badge ${currentCodes.access_type?.toLowerCase() || "free"}`}>
                                <i className="bi bi-tags-fill me-1"></i> {/* <----------  Price Tag Badge */}
                                {currentCodes.access_type}
                                {currentCodes.access_type === "Premium" && currentCodes.price ? ` • $${currentCodes.price}` : ""}
                            </span>
                        </div>
                    </div>


                    {/*-------- TOP RIGHT BUTTONS ---> [ Favourite, Share ] ---------*/}
                    <div className="header-actions">
                            <button
                                className={`cd-fav-btn ${isFavorite(currentCodes.id) ? "active" : ""}`}
                                onClick={() => handleFavorite(currentCodes.id)}
                                title={!profile ? "Login to add favorites" : isFavorite(currentCodes.id) ? "Remove from favorites" : "Add to favorites"}
                                style={{
                                fontSize: 22,
                                cursor: profile ? "pointer" : "not-allowed",
                                border: "none",
                                background: "transparent",
                                color: isFavorite(currentCodes.id) ? "red" : "#aaa",
                                transition: "color 0.2s",
                                }}
                            >
                                <span className="cd-fav-box">
                                    <i className="bi bi-heart-fill mx-3"></i>
                                </span>
                            </button>

                        <div className="share-dropdown">
                            <button className="action-btn share-btn" title="Share">
                                <i className="fa fa-share-alt" />
                            </button>
                            <div className="share-options">
                                <span onClick={() => handleShareClick("WhatsApp")}><FaWhatsapp className="share-icon" /> WhatsApp</span>
                                <span onClick={() => handleShareClick("Messenger")}><FaFacebookMessenger className="share-icon" /> Messenger</span>
                                <span onClick={() => handleShareClick("Facebook")}><FaFacebook className="share-icon" /> Facebook</span>
                                <span onClick={() => handleShareClick("Telegram")}><FaTelegram className="share-icon" /> Telegram</span>
                            </div>
                        </div>
                    </div>
                </div>


                {/* -------- header Buttons [ PREVIEW , CODE, FULL SCREEN, RECOMMENDED ----------- ] */}
                <div className="navigator-btns" style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="code-preview-open">
                        <button className={`action-btn preview-btn ${activeTab === "preview" ? "active" : ""}`} onClick={() => scrollToSection("preview")}>
                            <i className="bi bi-eye-fill" /> Preview
                        </button>
                        <button className={`action-btn code-btn ${activeTab === "code" ? "active" : ""}`} onClick={() => scrollToSection("code")}>
                            <i className="bi bi-code-slash" /> Code
                        </button>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                        <button className="action-btn fullscreen-btn" onClick={openFullscreen}>
                            <i className="bi bi-arrows-fullscreen" /> <span className="fullscreen-text"> Fullscreen </span>
                        </button>
                        <button
                            className="action-btn view-more-btn"
                            onClick={() => {
                            const section = document.querySelector(".related-topic-container");
                            const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 80;
                            if (section) {
                                const topPos = section.getBoundingClientRect().top + window.scrollY - navbarHeight;
                                window.scrollTo({ top: topPos, behavior: "smooth" });
                            }
                            }}
                        >
                            <i className="bi bi-stack" /> Recommended
                        </button>
                    </div>
                </div>


                {/* ------- CODE ------- */}
                <div ref={codeRef} style={{ display: activeTab === "code" ? "block" : "none", marginTop: 16 }}>
                    <Design_Code
                        codeId={currentCodes.id}
                        html={currentCodes.html}
                        css={currentCodes.css}
                        js={currentCodes.js}
                        access_type={currentCodes.access_type}
                        price={currentCodes.price}
                        hasBought={currentCodes.hasBought}
                        pageTab={activeTab}
                    />
                </div>

                {/* ------- PREVIEW --------- */}
                <div ref={previewRef} style={{ display: activeTab === "preview" ? "block" : "none", marginTop: 12 }}>
                    <Design_Preview 
                        srcDoc={srcDoc} 
                        device={device} 
                        changeDevice={changeDevice} 
                    />
                </div>
            </div>




        {/* ***************************************************************** */}
            {/*                  RECOMMENDED SECTION                     */}
        {/* ***************************************************************** */}
            <div className="related-topic-container">
                <h1 className="home-section-title">- Recommended -</h1>

                {/* ******* SEARCH BAR ****** */}
                <div className="cd-search-bar-wrapper" style={{ marginBottom: 12 }}>
                    <i className="fa fa-search" />
                    <input
                        type="text"
                        className="cd-search-bar"
                        placeholder=" Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>


                {/* ******** OTHER FILTER ******** */}
                <div style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className={`cd-filter-btns ${activeFilter === "all" ? "active" : ""}`} onClick={() => setActiveFilter("all")}>
                        <i className="fa fa-list" /> All
                    </button>
                    <button className={`cd-filter-btns ${activeFilter === "free" ? "active" : ""}`} onClick={() => setActiveFilter("free")}>
                        <i className="fa fa-unlock" /> Free
                    </button>
                    <button className={`cd-filter-btns premium ${activeFilter === "premium" ? "active" : ""}`} onClick={() => setActiveFilter("premium")}>
                        <FaGem /> Premium
                    </button>
                    <button className={`cd-filter-btns ${activeFilter === "latest" ? "active" : ""}`} onClick={() => setActiveFilter("latest")}>
                        <i className="fa fa-clock" /> Latest
                    </button>
                    <button className={`cd-filter-btns ${activeFilter === "oldest" ? "active" : ""}`} onClick={() => setActiveFilter("oldest")}>
                        <i className="fa fa-history" /> Oldest
                    </button>
                    <button  className={`cd-filter-btns ${activeFilter === "favorite" ? "active" : ""}`} onClick={() => setActiveFilter("favorite")} >
                        <i className="fa fa-heart" /> Favorite
                    </button>
                    <button className="cd-filter-btns" disabled><i className="fa fa-chart-bar" /> Clicked</button>
                </div>

                {/* ******* IFRAME GRID ******** */}
                <div className="related-videos-grid">
                    {filteredRelatedItems.length > 0 ? (
                        filteredRelatedItems.map((s, index) => { 
                            const smallSrcDoc = buildRecommendedIframeDoc(
                                s.html_code || s.html || "",
                                s.css_code || s.css || "",
                                s.js_code || s.js || "",
                            );

                            // NEW Badge Check
                            const showNewBadge = isNewItem(s.created_at);

                            return (
                                <React.Fragment key={s.id}> 
                                    <div
                                        className="related-video-item"
                                        onClick={() => handleRelatedClick(s)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => { if (e.key === "Enter") handleRelatedClick(s); }}
                                        style={{ position: 'relative' }}
                                    >
                                        {/* --- NEW BADGE --- */}
                                        {showNewBadge && (
                                            <div style={{ 
                                                position: 'absolute',
                                                top: '0',
                                                left: '0',
                                                background: '#379e81ff', // Dark contrast
                                                color: 'white',
                                                padding: '6px 14px',
                                                fontSize: '10px',
                                                fontWeight: '600',
                                                zIndex: 2,
                                                textTransform: 'uppercase',
                                                letterSpacing: '2px',
                                                borderRadius: '0 0 8px 0',
                                                borderRight: '1px solid',
                                                borderBottom: '1px solid',
                                            }}>
                                                New Arrival
                                            </div>
                                        )}

                                    {/* ----- PREMIUM BADGE ------- */}
                                        {s.access_type === "Premium" && (
                                            <div style={{ 
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            background: 'rgba(29, 29, 28, 0.9)',
                                            color: 'gold',
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            zIndex: 2
                                            }}>
                                                <FaGem style={{ fontSize: '10px' }} /> ${s.price || 0}
                                            </div>
                                        )}

                                        <iframe
                                            srcDoc={smallSrcDoc}
                                            sandbox="allow-scripts allow-forms allow-modals"
                                            title={s.title || `related-${s.id}`}
                                            style={{ 
                                            width: "100%", 
                                            height: 'auto', 
                                            border: "none", 
                                            borderBottom: "1px solid" ,
                                            }}
                                        />

                                        <span> 
                                            <FaPlay /> &nbsp; {s.title || "Untitled"}
                                        </span>
                                    </div>

                                    {(index + 1) % 3 === 0 && (
                                        <div className="related-video-item ad-placement">
                                            <Ads_Square_Display />
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })
                    ) : (
                        <div className="no-components-message" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#888" }}>
                            <h4>
                                😖 Oops!!! 😖
                                    <br />
                                    <br />
                                For this category
                                    <br />
                                No More Components Available right now but will be uploaded soon
                            </h4>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}