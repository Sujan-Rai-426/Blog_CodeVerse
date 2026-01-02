import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Library_Topic, Library } from './Library_Imports'


const Library_Routes = () => {
    return (
        <Routes>
            <Route exact path="topics/" element={<Library_Topic />} />
            <Route exact path=":topicsID/:libraryID/" element={<Library />} />
        </Routes>
    )
}

export default Library_Routes