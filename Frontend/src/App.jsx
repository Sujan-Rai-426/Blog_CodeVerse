import { useState } from 'react'
import './App.css'
// import ProtectedRoute from './context/ProtectedRoute';

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Navbar from './components/Navbar.jsx' 
import Home from './pages/Home.jsx'
import Footer from './components/Footer.jsx'
import Frontend_Tutorial_Solution from './pages/Frontend_Tutorial_Solution.jsx';
import Backend_Tutorial_Solution from './pages/Backend_Tutorial_Solution.jsx';
import Frontend_Tutorial_Topic from './pages/Frontend_Tutorial_Topic.jsx';
import Backend_Tutorial_Topic from './pages/Backend_Tutorial_Topic.jsx';
import Admin_Dashboard from './pages/Admin_Dashboard.jsx';
import Admin_Login from './pages/Admin_Login.jsx';
import Protected_Route from './context/Protected_Route.jsx';

function App() {

  return (
    <Router>
        
        <Navbar />

            <div className="container">
                  <Routes>
                      <Route exact path='/'  element={ <Home/> } />
                      
                      <Route exact path='/Frontend_Tutorial_Solution/:topicID'  element={ <Frontend_Tutorial_Solution/> } />
                      <Route exact path='/Backend_Tutorial_Solution/:topicID'  element={ <Backend_Tutorial_Solution/> } />
                      <Route exact path='/Frontend_Tutorial_Topic/:languageID'  element={ <Frontend_Tutorial_Topic/> } />
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
  )
}

export default App
