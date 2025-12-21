import React from 'react'
import {Routes, Route} from "react-router-dom"
import { 
    PlayGround_Code_Compiler, 
    PlayGround_Code_Generator 
} from './PlayGround_Imports'

function PlayGround_Routes() {
    return (
        <Routes>
            <Route exact path="Code-Compiler/" element={ <PlayGround_Code_Compiler/> } />
            <Route exact path="Code-Generator/" element={ <PlayGround_Code_Generator/> } />
        </Routes>
    )
}

export default PlayGround_Routes