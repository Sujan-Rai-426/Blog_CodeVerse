import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../assets/css/Recent_Contents.css";
import api from "../config/api";
import { FaGem } from "react-icons/fa";

const buildIframeDoc = (html = "", css = "", js = "", aspectWidth = 1333, aspectHeight = 850) => {
    const safeJs = (js || "").trim().replace(/<\/script>/gi, "<\\/script>");
    return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          html, body { margin:0; padding:0; width:100%; height:100%; display:flex; flex-direction:xccolumn; justify-content:center; align-items:center; background:transparent; overflow:hidden; }
          .scaleWrapper { width:1338px; position:relative; height:100%; display:flex; justify-content:center; align-items:center; overflow:hidden; }
          .scaleInner { width:${aspectWidth}px; height:${aspectHeight}px; position:absolute; display:flex; justify-content:center; align-items:center; transform-origin:center center; }
          ${css || ""}
        </style>
      </head>
      <body>
        <div class="scaleWrapper">
          <div class="scaleInner" id="scaleInner">
            ${html || "<p style='color:#aaa'>No Preview</p>"}
          </div>
        </div>
        <script>
          try { ${safeJs} } catch(err) { console.error("Preview JS error:", err); }
          function resizeScale() {
            const inner = document.getElementById("scaleInner");
            if (!inner) return;
            const scale = Math.min(window.innerWidth/inner.offsetWidth, window.innerHeight/inner.offsetHeight);
            inner.style.transform = 'scale(' + scale + ')';
          }
          window.addEventListener('load', resizeScale);
          window.addEventListener('resize', resizeScale);
        </script>
      </body>
    </html>`;
};

function Recent_Contents() {
    const navigate = useNavigate();
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComponents = async () => {
            try {
                const res = await api.get("/api/frontend-source-codes/");
                const latest6 = [...res.data].sort((a,b)=>b.id - a.id).slice(0,6);
                setComponents(latest6);
            } catch (err) {
                console.error("Failed to fetch components:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchComponents();
    }, []);

    if (loading) {
        return (
            <SkeletonTheme baseColor="#1c1c1c" highlightColor="#2a2a2a">
                <div className="row g-4">
                    {[1,2,3,4,5,6].map(i=>(
                        <div className="col-12 col-md-6 col-lg-4" key={i}>
                            <div className="card shadow-sm border-0 rounded-4 overflow-hidden tutorial-card p-2">
                                <Skeleton height={200} borderRadius={10}/>
                                <div className="card-body py-2">
                                    <Skeleton width="70%" height={20} className="mb-2 mt-3"/>
                                    <Skeleton width="90%" height={14} count={2}/>
                                    <Skeleton width={100} height={30} borderRadius={20} className="mt-3"/>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </SkeletonTheme>
        );
    }

    if (error) return <p className="text-center text-danger py-5">Failed to load components.</p>;

    const handleNavigate = (topicId, sourceId) => {
        navigate(`/Component-Designs/${topicId}/${sourceId}`);
        window.scrollTo({top:0, behavior:'smooth'});
    };

    return (
        <div className="g-4 recent-cards-container">
            {components.length === 0 ? (
                <p className="text-center text-muted py-5">No recent components found.</p>
            ) : components.map(c => {
                const isPremium = (c.access_type || "").toLowerCase() === "premium";
                const iframeDoc = buildIframeDoc(c.html_code || "", c.css_code || "", c.js_code || "");

                return (
                    <div key={c.id}>
                        <div
                            className="card shadow-sm border-0 rounded-4 overflow-hidden tutorial-card position-relative"
                            onClick={()=>handleNavigate(c.topic, c.id)}
                            style={{cursor:'pointer'}}
                        >
                            <div className="video-container position-relative">
                                <iframe
                                    title={`preview-${c.id}`}
                                    srcDoc={iframeDoc}
                                    className="iframe-preview"
                                    sandbox="allow-scripts"
                                    style={{height:200, width:"100%", border:"none", display:"block"}}
                                />
                                {isPremium && (
                                    <div style={{
                                        position:'absolute',
                                        top:8,
                                        right:8,
                                        background:'gold',
                                        color:'#000',
                                        padding:'4px 8px',
                                        borderRadius:4,
                                        fontSize:12,
                                        fontWeight:'bold',
                                        display:'flex',
                                        alignItems:'center',
                                        gap:4,
                                        zIndex:10
                                    }}>
                                        <FaGem/> &nbsp; ${c.price || 0}
                                    </div>
                                )}
                            </div>
                            <div className="card-body py-2">
                                <h5 className="recent-card-title">{c.title || c.topic_name || "Untitled"}</h5>
                                <button
                                    className="btn btn-outline-warning btn-sm rounded-pill"
                                    onClick={(e)=>{e.stopPropagation(); handleNavigate(c.topic, c.id);}}
                                >
                                    View Code →
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Recent_Contents;
