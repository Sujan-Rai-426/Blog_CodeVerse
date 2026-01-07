import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Library_Topic, Library, Library_Documentation } from './Library_Imports'


const Library_Routes = () => {
    return (
        <Routes>
            <Route exact path="topics/" element={<Library_Topic />} />
            <Route exact path=":topicsID/:libraryID/" element={<Library />} />
            <Route exact path='documentation/' element={<Library_Documentation />} />
        </Routes>
    )
}

export default Library_Routes