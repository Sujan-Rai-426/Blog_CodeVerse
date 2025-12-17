import React from "react";
import { Routes, Route } from "react-router-dom";

// Normal Pages imports
import Home from "../pages/Home";
import Contact from "../email/Contact";
import About from "../pages/About";
import Privacy_Policy from "../pages/Privacy_Policy";
import PlayGround from "../pages/PlayGround";

// Payment Pages imports
import Payment_Success from "../payment/payment_status/Payment_Success";
import Payment_Fail from "../payment/payment_status/Payment_Fail";
import Payment_Page from "../payment/payment_status/Payment_Page";

// Unavailable Page imports
import Unavailable_Page from "../components/Unavailable_Page";
import { Parent_Api_Provider } from "../context/Parent_API_Provider";
import { Payment_Provider } from "../payment/payment_status/Payment_Context";
import User_API_Provider from "../clients/User_API_Provider";

function Routes_List() {
    return (
        <div>

                        <Routes>
                            {/* Normal Routes */}
                            <Route exact path="/" element={<Home />} />
                            <Route exact path="/About" element={<About />} />
                            <Route exact path="/Contact" element={<Contact />} />
                            <Route exact path="/Privacy_Policy" element={<Privacy_Policy />} />
                            <Route exact path="/PlayGround" element={<PlayGround />} />

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