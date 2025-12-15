import React, { useEffect, useRef } from 'react'
import { Route, Routes } from 'react-router-dom'
import Components from './Components'
import Components_Topic from './Components_Topic'
import User_API_Provider from '../clients/User_API_Provider'
import { Parent_Api_Provider } from '../context/Parent_API_Provider'
import Components_Right_Sidebar from './Components_Right_Sidebar'
import Components_Left_Sidebar from './Components_Left_Sidebar'

import "../assets/css/Components_Route.css"

function Components_Route() {


    // Detect zoom size of screen using js so that we can hide sidebar if zoom too big more than 115%
    const zoomTimeout = useRef(null)
    useEffect(() => {
        const handleZoom = () => {
            clearTimeout(zoomTimeout.current)
            zoomTimeout.current = setTimeout(() => {
                const zoomLevel = Math.round(
                    (window.outerWidth / window.innerWidth) * 100
                )
                document.body.classList.toggle('cr-zoomed', zoomLevel > 115)
            }, 100)
        }
        handleZoom()
        window.addEventListener('resize', handleZoom)
        return () => {
            clearTimeout(zoomTimeout.current)
            window.removeEventListener('resize', handleZoom)
        }
    }, [])


    return (
        <User_API_Provider>
            <Parent_Api_Provider>

                <div className="cr-layout-wrapper" style={{display:'flex', justifyContent:'space-between'}}>

                {/* LEFT SIDEBAR */}
                    <aside className="cr-sidebar cr-left-sidebar">
                        <Components_Left_Sidebar />
                    </aside>

                {/* MAIN CONTENT (BODY SCROLLS) */}
                    <main className="cr-main-content fs-6 container">
                        <Routes>
                            <Route path="/:topicID/:codeId?" element={<Components />} />
                            <Route path="/Topics/:languageID" element={<Components_Topic />} />
                        </Routes>
                    </main>

                {/* RIGHT SIDEBAR */}
                    <aside className="cr-sidebar cr-right-sidebar">
                        <Components_Right_Sidebar />
                    </aside>

                </div>

            </Parent_Api_Provider>
        </User_API_Provider>
    )
}

export default Components_Route
