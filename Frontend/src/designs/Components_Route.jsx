import React, { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Components from "./Components";
import Components_Topic from "./Components_Topic";


import Components_Right_Sidebar from "./Components_Right_Sidebar";
import Components_Left_Sidebar from "./Components_Left_Sidebar";

import "../assets/css/Components_Route.css";

function Components_Route() {
    const location = useLocation();
    const zoomTimeout = useRef(null);

  /* ================= PAGE TYPE DETECTION (ROBUST) for conditional sidebar showing ================= */
    useEffect(() => {
        const body = document.body;
        body.classList.remove("cr-components-page", "cr-topics-page");
        if (location.pathname.includes("/Components/Topics")) {
            body.classList.add("cr-topics-page");
        } else if (location.pathname.startsWith("/Components")) {
            body.classList.add("cr-components-page");
        }
        return () => {
            body.classList.remove("cr-components-page", "cr-topics-page");
        };
    }, [location.pathname]);

  /* ================= ZOOM HANDLING ================= */
    useEffect(() => {
        const handleZoom = () => {
            clearTimeout(zoomTimeout.current);
            zoomTimeout.current = setTimeout(() => {
                const zoomLevel = Math.round(
                (window.outerWidth / window.innerWidth) * 100
                );
                document.body.classList.toggle("cr-zoomed", zoomLevel > 115);
            }, 100);
        };
        handleZoom();
        window.addEventListener("resize", handleZoom);
        return () => {
            clearTimeout(zoomTimeout.current);
            window.removeEventListener("resize", handleZoom);
        };
    }, []);

    return (
        <div className="cr-layout-wrapper">

        {/* LEFT SIDEBAR */}
            <aside className="cr-sidebar cr-left-sidebar">
                <Components_Left_Sidebar />
            </aside>

        {/* MAIN CONTENT */}
            <main className="cr-main-content fs-6 container">
                <Routes>
                    <Route path="/" element={<Components />} />
                    <Route path=":topicID/:codeId?" element={<Components />} />
                    <Route path="Topics/:languageID" element={<Components_Topic />} />
                </Routes>
            </main>

        {/* RIGHT SIDEBAR */}
            <aside className="cr-sidebar cr-right-sidebar">
                <Components_Right_Sidebar />
            </aside>

            </div>
    );
}

export default Components_Route;
