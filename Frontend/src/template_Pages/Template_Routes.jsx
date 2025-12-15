import React, { useEffect, useRef } from 'react'
import { Route, Routes } from 'react-router-dom'
import Template_Preview from './Template_Preview'
import { Templates_API_Provider } from './Template_API'
import Template_Topics from './Template_Topics'
import Template from './Template'
import User_API_Provider from  "../clients/User_API_Provider"
import Template_Right_Sidebar from './Template_Right_Sidebar'
import Template_Left_Sidebar from './Template_Left_Sidebar'
import "../assets/css/Template_Routes.css"

function Template_Routes() {


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
        <div style={{ minHeight: "100vh" }}>
            <User_API_Provider>
                <Templates_API_Provider>


                <div style={{display: 'flex'}}>

                    {/* <aside className=' tr-left-sidebar '>
                        <Template_Left_Sidebar />
                    </aside> */}

                    <main className=' tr-main-container container'>
                        <Routes>
                            <Route exact path="/:id" element={<Template />} />
                            <Route exact path="/Topics" element={<Template_Topics />} />
                            <Route exact path="/Preview/:id" element={<Template_Preview />} />
                        </Routes>
                    </main>

                    {/* <aside className=' tr-right-sidebar '>
                        <Template_Right_Sidebar/>
                    </aside> */}

                </div>


                </Templates_API_Provider>
            </User_API_Provider>
        </div>
    )
}

export default Template_Routes