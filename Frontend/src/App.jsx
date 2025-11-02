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

function App() {

  return (

    <>
    
        <Router>
            <Scroll_To_Top />
            <Nav_Bar />

                <div className="container" style={{minHeight: "100vh"}}>
                      <Routes >
                          <Route exact path='/'  element={ <Home/> } />
                          <Route exact path='/About'  element={ <About/> } />
                          <Route exact path='/Privacy_Policy'  element={ <Privacy_Policy/> } />
                          
                          <Route exact path='/Frontend_Tutorial_Solution/:topicID'  element={ <Frontend_Tutorial_Solution/> } />
                          <Route exact path='/Backend_Tutorial_Solution/:topicID'  element={ <Backend_Tutorial_Solution/> } />\

                          {/* Frontend_Tutorial_Topic is Frontend Design */}
                          <Route exact path='/Frontend_Tutorial_Topic/:languageID'  element={ <Frontend_Tutorial_Topic/> } />

                          {/* Backend_Tutorial_Topic is Coding Guide Topic */}
                          <Route exact path='/Backend_Tutorial_Topic/:languageID'  element={ <Backend_Tutorial_Topic/> } />

                          <Route exact path="/Admin_Login" element={<Admin_Login />} />


                            {/* Protected Dashboard */}
                          <Route element={<Protected_Route />}>
                            <Route path="/Admin_Dashboard" element={<Admin_Dashboard />} />
                          </Route>

                      </Routes>
                </div>
            
            <Footer />

        </Router>

      {/* Add Vercel Analytics at the bottom */}
      <Analytics />
    </>
  )
}

export default App
