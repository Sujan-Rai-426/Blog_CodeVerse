import React from 'react'

import{
    Template_Preview,
    Template_Left_Sidebar,
    Template_Right_Sidebar,
} from "./Template_Imports"

import "../assets/css/Template.css"


function Template() {
    return (

        <div className='t-template-container'>

        {/* ************* Main Components Contents ******************** */}
            {/* <span className='t-template-left-sidebar'><Template_Left_Sidebar /></span> */}


        {/* ************* Main Components Contents ******************** */}
            <Template_Preview />
        
        
        {/* ************* Main Components Contents ******************** */}
            {/* <span className='t-template-right-sidebar'><Template_Right_Sidebar /></span> */}
        
        </div>

    )
}

export default Template