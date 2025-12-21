import React from 'react'
import { Routes, Route } from 'react-router-dom'
import {
    Utility_Topics,
    Utility,
    Utility_Code,
    Utility_Preview,
} from './Utiltiy_Imports'

function Utility_Route() {
    return (
        <div className='container' style={{minHeight: '100vh'}}>
            <Routes>
                <Route exact path='/' element={<Utility />}/>
                <Route exact path='Topics/' element={<Utility_Topics />}/>
                <Route exact path='Code/' element={<Utility_Code />}/>
                <Route exact path='Preview/' element={<Utility_Preview />}/>
            </Routes>
        </div>
    )
}

export default Utility_Route