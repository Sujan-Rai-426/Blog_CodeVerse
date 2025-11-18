import { useState } from 'react';

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Scroll_To_Top from './context/Scroll_To_Top.jsx';

// For Vercel analytics
import { Analytics } from "@vercel/analytics/react"

import Nav_Bar from './components/Nav_Bar.jsx' 
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Footer from './components/Footer.jsx'
import Frontend_Tutorial_Solution from './pages/Frontend_Tutorial_Solution.jsx';
import Backend_Tutorial_Solution from './pages/Backend_Tutorial_Solution.jsx';
import Frontend_Tutorial_Topic from './pages/Frontend_Tutorial_Topic.jsx';
import Backend_Tutorial_Topic from './pages/Backend_Tutorial_Topic.jsx';
import Admin_Dashboard from './pages/Admin_Dashboard.jsx';
import Admin_Login from './pages/Admin_Login.jsx';
import Protected_Route from './context/Protected_Route.jsx';
import Privacy_Policy from './pages/Privacy_Policy.jsx';


// For Helping Button
import Floating_Share_Btn from './components/Floating_Share_Btn.jsx';
import Floating_Go_Back_Btn from './components/Floating_Go_Back_Btn.jsx';


// For Payment Handle
import { Payment_Provider } from './payment/payment_status/Payment_Context.jsx';
import Payment_Success from "./payment/payment_status/Payment_Success.jsx";
import Payment_Fail from "./payment/payment_status/Payment_Fail.jsx";
import Payment_Page from "./payment/payment_status/Payment_Page.jsx";


// For Unavailable and in Development phase
import Unavailable_Page from './components/Unavailable_Page.jsx';
import Floating_Donate_Me from './payment/donation/Floating_Donate_Me.jsx';

// for fetching once in parent and use same api in every page, instead of constant fetching --> to solve lack of persistence loading problem
import { Parent_Api_Provider } from './context/Parent_API_Provider.jsx';
import PlayGround from './pages/PlayGround.jsx';
import Contact from './email/Contact.jsx';





function App() {

  return (

    <Parent_Api_Provider>
    

        <Payment_Provider> 
        
            <>
                <Router>

                    {/* Sticky Floating share and Go back button visible on all pages */}
                    <Floating_Share_Btn />
                    <Floating_Go_Back_Btn />
                    <Floating_Donate_Me />

                    {/* Auto Scroll top component */}
                    <Scroll_To_Top />

                    {/* Navbar */}
                    <Nav_Bar />

                        <div className="container" style={{minHeight: "100vh"}}>
                              
                              
                              <Routes >
                                  <Route exact path='/'  element={ <Home/> } />
                                  <Route exact path='/About'  element={ <About/> } />
                                  <Route exact path='/Privacy_Policy'  element={ <Privacy_Policy/> } />
                                  
                                  <Route exact path='/Frontend_Tutorial_Solution/:topicID/:videoId?'  element={ <Frontend_Tutorial_Solution  />  } />
                                  <Route exact path='/Backend_Tutorial_Solution/:topicID'  element={ <Backend_Tutorial_Solution/> } />\

                                  {/* Frontend_Tutorial_Topic is Frontend Design */}
                                  <Route exact path='/Frontend_Tutorial_Topic/:languageID'  element={ <Frontend_Tutorial_Topic/> } />

                                  {/* Backend_Tutorial_Topic is Coding Guide Topic */}
                                  <Route exact path='/Backend_Tutorial_Topic/:languageID'  element={ <Backend_Tutorial_Topic/> } />

                                  <Route exact path="/Admin_Login" element={<Admin_Login />} />


                                  <Route exact path="/PlayGround" element={<PlayGround />} />
                                  <Route exact path="/Contact" element={<Contact />} />


                                    {/* Protected Dashboard */}
                                  <Route element={<Protected_Route />}>
                                    <Route  exact path="/Admin_Dashboard" element={<Admin_Dashboard />} />
                                  </Route>

                                    {/* Payment */}
                                  <Route  exact path="/payment-success" element={<Payment_Success />} />
                                  <Route  exact path="/payment-fail" element={<Payment_Fail />} />
                                  <Route  exact path="/Payment_Page" element={<Payment_Page />} />


                                  {/* Unavailable and in development phase */}
                                  <Route exact path='/Unavailable' element={<Unavailable_Page />} />

                              </Routes>
                        </div>
                    
                    <Footer />

                </Router>

                {/* Add Vercel Analytics at the bottom */}
                <Analytics />
            </>

        </ Payment_Provider>

    </ Parent_Api_Provider>
  )
}

export default App
