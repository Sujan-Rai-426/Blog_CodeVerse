import React from 'react'
import User_Login from './User_Login'
import User_Signup from './User_Signup'
import User_Protected_Route from './User_Protected_Route'
import { Route, Routes } from 'react-router-dom'
import User_Profile from './User_Profile'
import User_Login_Redirect from './User_Login_Redirect'

function User_Routes() {
    return (
        
        <div className='container' style={{minHeight: "100vh",}} >
            
            <Routes>

                <Route path="/accounts/social-login-redirect" element={<User_Login_Redirect />} />

                <Route element={<User_Protected_Route />}>
                    <Route path="/Profile" element={<User_Profile />} />
                </Route>

                <Route path="/Login" element={<User_Login />} />
                <Route path="/Signup" element={<User_Signup />} />


            </Routes>


        </div>

    )
}

export default User_Routes