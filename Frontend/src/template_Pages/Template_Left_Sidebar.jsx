import React from 'react'
import "../assets/css/Template_Right_Sidebar.css"
import Interactive_Grid_Background from '../context/Interactive_Grid_Background'


function Template_Left_Sidebar() {
    return (
    <Interactive_Grid_Background>
        <div className="container text-center my-5">
            <main>
                <h1>My Awesome Site</h1>
                <button onClick={() => alert("Clicked!")} className='btn-success btn'>Interactive Button</button>
            </main>
        </div>
    </Interactive_Grid_Background>
    )
}

export default Template_Left_Sidebar