import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Templates from './Templates'
import Template_Preview from './Template_Preview'
import { Templates_API_Provider } from './Template_API'

function Template_Routes() {
    return (
        <div className="container" style={{ minHeight: "100vh" }}>
            <Templates_API_Provider>
                <Routes>
                
                    <Route exact path="/" element={<Templates />} />
                    <Route exact path="/Preview/:id" element={<Template_Preview />} />
                
                </Routes>
            </Templates_API_Provider>
        </div>
    )
}

export default Template_Routes