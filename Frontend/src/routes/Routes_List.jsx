import React from "react";
import { Routes, Route } from "react-router-dom";

// Normal Pages imports
import {
    Home, 
    Contact, 
    About, 
    Privacy_Policy, 
} from "../context/Import_Files"


// Payment Pages imports
import Payment_Success from "../payment/payment_status/Payment_Success";
import Payment_Fail from "../payment/payment_status/Payment_Fail";
import Payment_Page from "../payment/payment_status/Payment_Page";



function Routes_List() {
    return (
        <div>

                        <Routes>
                            {/* Normal Routes */}
                            <Route exact path="/" element={<Home />} />
                            <Route exact path="/About" element={<About />} />
                            <Route exact path="/Contact" element={<Contact />} />
                            <Route exact path="/Privacy_Policy" element={<Privacy_Policy />} />

                            {/* Payment Routes */}
                            <Route exact path="/Payment_Success" element={<Payment_Success />} />
                            <Route exact path="/Payment_Failure" element={<Payment_Fail />} />
                            <Route exact path="/Payment_Page" element={<Payment_Page />} />

                        </Routes>

        </div>
    );
}

export default Routes_List;