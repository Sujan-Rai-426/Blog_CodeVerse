import React from "react";
import { Routes, Route } from "react-router-dom";

// Normal Pages imports
import Home from "../pages/Home";
import Contact from "../email/Contact";
import About from "../pages/About";
import Privacy_Policy from "../pages/Privacy_Policy";
import PlayGround from "../pages/PlayGround";

// Frontend and Backend Tutorial Pages imports
import Coding_Guide from "../coding_Guide/Coding_Guide";
import Coding_Guide_Topic from "../coding_Guide/Coding_Guide_Topic";

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

// Unavailable Page imports
import Unavailable_Page from "../components/Unavailable_Page";
import { Parent_Api_Provider } from "../context/Parent_API_Provider";
import { Payment_Provider } from "../payment/payment_status/Payment_Context";

function Routes_List() {
    return (
        <div className="container" style={{ minHeight: "100vh" }}>

            <Parent_Api_Provider> {/* <---- To fetch API once by parent and use it all over the frontend to overcome repeatative api fetch*/}
                    
                <Payment_Provider> {/* <---- For payment */}
            
                    <Routes>
                        {/* Normal Routes */}
                        <Route exact path="/" element={<Home />} />
                        <Route exact path="/About" element={<About />} />
                        <Route exact path="/Contact" element={<Contact />} />
                        <Route exact path="/Privacy_Policy" element={<Privacy_Policy />} />
                        <Route exact path="/PlayGround" element={<PlayGround />} />


                        {/* Frontend and Backend Tutorial routes */}
                        <Route exact path="/Component-Designs/:topicID/:codeId?" element={<Components_Design />} />
                        <Route exact path="/Component-Topics/:languageID" element={<Components_Topic />} />
                        <Route exact path="/Coding_Guide/:topicID" element={<Coding_Guide />} />
                        <Route exact path="/Coding_Guide_Topic/:languageID" element={<Coding_Guide_Topic />} />


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

                </ Payment_Provider>

            </ Parent_Api_Provider>
        </div>
    );
}

export default Routes_List;