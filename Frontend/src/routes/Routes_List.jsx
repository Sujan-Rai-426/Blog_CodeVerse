import React from "react";
import { Routes, Route } from "react-router-dom";

// Normal Pages imports
import Home from "../pages/Home";
import Contact from "../email/Contact";
import About from "../pages/About";
import Privacy_Policy from "../pages/Privacy_Policy";
import PlayGround from "../pages/PlayGround";

// Frontend and Backend Tutorial Pages imports
import Backend_Tutorial_Solution from "../pages/Backend_Tutorial_Solution";
import Backend_Tutorial_Topic from "../pages/Backend_Tutorial_Topic";

// Frontend Or DESIGN Tutorials import
import Components_Design from "../designs/Components_Design";
import Components_Topic from "../designs/Components_Topic";

// Client or User Dashboard Pages imports
import User_Profile from "../clients/User_Profile";
import User_Protected_Route from "../clients/User_Protected_Route";


// Payment Pages imports
import Payment_Success from "../payment/payment_status/Payment_Success";
import Payment_Fail from "../payment/payment_status/Payment_Fail";
import Payment_Page from "../payment/payment_status/Payment_Page";

// Template Pages import
import Templates from "../template_Pages/Templates";
import Template_Preview from "../template_Pages/Template_Preview";

// Unavailable Page imports
import Unavailable_Page from "../components/Unavailable_Page";

// Admin Pages imports
import Admin_Login from "../admin/Admin_Login";
import Admin_Home from "../admin/Admin_Home";
import { Admin_API_Provider } from "../admin/Admin_API_Provider";
import Admin_Protected_Route from "../admin/Admin_Protected_Route";

function Routes_List() {
    return (
        <div className="container" style={{ minHeight: "100vh" }}>
            <Routes>
                {/* Normal Routes */}
                <Route exact path="/" element={<Home />} />
                <Route exact path="/About" element={<About />} />
                <Route exact path="/Contact" element={<Contact />} />
                <Route exact path="/Privacy_Policy" element={<Privacy_Policy />} />
                <Route exact path="/PlayGround" element={<PlayGround />} />

                {/* Template Routes */}
                <Route exact path="/Templates" element={<Templates />} />
                <Route exact path="/Templates/:id" element={<Template_Preview />} />

                {/* Frontend and Backend Tutorial routes */}
                <Route exact path="/Component-Designs/:topicID/:codeId?" element={<Components_Design />} />
                <Route exact path="/Component-Topics/:languageID" element={<Components_Topic />} />
                <Route exact path="/Backend_Tutorial_Solution/:topicID" element={<Backend_Tutorial_Solution />} />
                <Route exact path="/Backend_Tutorial_Topic/:languageID" element={<Backend_Tutorial_Topic />} />


                {/* Admin Login */}
                <Route path="/Admin_Login" element={<Admin_Login />} />

                {/* Protected admin routes */}
                <Route element={<Admin_Protected_Route />}>
                    <Route path="/Admin" element={<Admin_Home />} />
                </Route>



                {/* Protected User Dashboard Routes */}
                <Route element={<User_Protected_Route />}>
                    <Route exact path="/User-Profile" element={<User_Profile />} />
                </Route>

                {/* Payment Routes */}
                <Route exact path="/Payment_Success" element={<Payment_Success />} />
                <Route exact path="/Payment_Failure" element={<Payment_Fail />} />
                <Route exact path="/Payment_Page" element={<Payment_Page />} />

                {/* Unavailable Page */}
                <Route exact path="/Unavailable" element={<Unavailable_Page />} />
            </Routes>
        </div>
    );
}

export default Routes_List;
