import React from 'react';
import Library_Body from './Library_Body';
import { Components_Left_Sidebar, Components_Right_Sidebar } from "../designs/Components_Imports";
import "./assets/css/Library.css"
import { useParams } from 'react-router-dom';

const Library = () => {

    // This matches /:topicsID/:libraryID/ from Library_Routes
    const { libraryID } = useParams();

    return (
        <div className="layout-wrapper library-page">
            {/* <aside className="lib-left-sidebar">
                <Components_Left_Sidebar />
            </aside> */}

            <main className="main-body container">
                <Library_Body componentId={libraryID}/>
            </main>

            <aside className="lib-right-sidebar">
                <Components_Right_Sidebar />
            </aside>
        </div>
    );
};

export default Library;