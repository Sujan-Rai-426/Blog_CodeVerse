import React from "react";
import { Route, Routes } from "react-router-dom";
import User_Login from "./User_Login";
import User_Signup from "./User_Signup";
import User_Protected_Route from "./User_Protected_Route";
import User_Profile from "./User_Profile";
import User_Edit_Profile from "./User_Edit_Profile";

export default function User_Routes() {
    return (
        <div className="container" style={{ minHeight: "100vh" }}>
                <Routes>
                    {/* Protected Routes */}
                    <Route element={<User_Protected_Route />}>
                        <Route path="Profile/" element={<User_Profile />} />
                    </Route>

                    {/* Public Routes */}
                    <Route path="Login/" element={<User_Login />} />
                    <Route path="Signup/" element={<User_Signup />} />
                    <Route path="Edit-Profile/" element={<User_Edit_Profile />} />
                </Routes>
        </div>
    );
    }
