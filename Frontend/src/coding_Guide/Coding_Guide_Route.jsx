import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Coding_Guide from './Coding_Guide'
import Coding_Guide_Topic from './Coding_Guide_Topic'
import { Parent_Api_Provider } from '../context/Parent_API_Provider'
import User_API_Provider from "../clients/User_API_Provider"
import Components_Right_Sidebar from "../designs/Components_Right_Sidebar"
import "../assets/css/Coding_Guide_Route.css"

function Coding_Guide_Route() {
    return (

    <User_API_Provider>
        <Parent_Api_Provider>

        <div style={{display: "flex", justifyContent:'space-between',}}>  
            
            <main className='cgr-main-container container'>
                <Routes>
                    <Route path="/:topicID" element={<Coding_Guide />} />
                    <Route path="/Topic/:languageID" element={<Coding_Guide_Topic />} />
                </Routes>
            </main>

            <aside className='cgr-right-sidebar'>
                <Components_Right_Sidebar />
            </aside>
        </div>

        </Parent_Api_Provider>
    </User_API_Provider>

    )
}

export default Coding_Guide_Route