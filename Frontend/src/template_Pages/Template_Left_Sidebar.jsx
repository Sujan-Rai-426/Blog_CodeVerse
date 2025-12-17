import React from 'react'
import "../assets/css/Template_Right_Sidebar.css"
import Interactive_Grid_Background from '../context/Interactive_Grid_Background'


function Template_Left_Sidebar() {
    return (
    <Interactive_Grid_Background>
        <nav>Navbar Content</nav>
        <main>
            <h1>My Awesome Site</h1>
            <button onClick={() => alert("Clicked!")}>Interactive Button</button>
        </main>
    </Interactive_Grid_Background>
    )
}

export default Template_Left_Sidebar