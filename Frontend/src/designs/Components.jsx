import React from 'react'
import Components_Design from './Components_Design'
import Components_Left_Sidebar from './Components_Left_Sidebar'
import Components_Right_Sidebar from './Components_Right_Sidebar'
import "../assets/css/Components.css"

function Components() {
    return (
        <div className='c-components-container'>

        {/* ************* Main Components Contents ******************** */}
            <span className='c-components-left-sidebar'><Components_Left_Sidebar /></span>


        {/* ************* Main Components Contents ******************** */}
            <Components_Design />
        
        
        {/* ************* Main Components Contents ******************** */}
            {/* <span className='c-components-right-sidebar'><Components_Right_Sidebar /></span> */}
        
        </div>
    )
}

export default Components