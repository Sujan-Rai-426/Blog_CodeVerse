import React from 'react'
import "../assets/css/Template_Right_Sidebar.css"
import Interactive_Grid_Background from '../context/Interactive_Grid_Background'


function Template_Left_Sidebar() {
    return (
        // Key Fix: Add className="min-h-screen" to define the minimum height of the background
        <Interactive_Grid_Background className="min-h-screen"> 
            
            {/* 1. Use <h1> for correct HTML structure */}
            {/* 2. Add some classes (e.g., text-white p-8) for visibility and spacing */}
            <h1 className="text-white text-3xl p-8">Template_Left_Sidebar</h1>
            
            {/* Add other content here, it will push the background down */}
            
        </Interactive_Grid_Background>
    )
}

export default Template_Left_Sidebar