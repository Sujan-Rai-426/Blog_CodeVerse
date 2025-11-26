import { BrowserRouter, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Scroll_To_Top from './context/Scroll_To_Top.jsx';

// For Vercel analytics
import { Analytics } from "@vercel/analytics/react"

import Nav_Bar from './components/Nav_Bar.jsx' 
import Footer from './components/Footer.jsx'
import Floating_Share_Btn from './components/Floating_Share_Btn.jsx';
import Floating_Go_Back_Btn from './components/Floating_Go_Back_Btn.jsx';
import { Payment_Provider } from './payment/payment_status/Payment_Context.jsx';
// import Floating_Donate_Me from './payment/donation/Floating_Donate_Me.jsx';
import { Parent_Api_Provider } from './context/Parent_API_Provider.jsx';
import { Templates_API_Provider } from './template_Pages/Template_API.jsx';
import Routes_List from './routes/Routes_List.jsx';
import Admin_Routes from './admin/Admin_Routes.jsx';
import User_Routes from './clients/User_Routes.jsx';


function App() {
  return (

    <Router>
          <Nav_Bar /> 

        {/*  Routes and Urls */}
              <Routes>
                  {/* Admin Route */}
                    <Route path='/Admin/*' element={<Admin_Routes />} />

                  {/* Client Route */}
                    <Route path='/User/*' element={<User_Routes />} />
                    
                  {/* All routes */}
                    <Route path="/*" element={<Routes_List />} /> 
              </Routes>

          <Footer /> 


        {/* ---------- Sticky Buttons ---------- */}
            <Analytics />  {/* <--- Add Vercel Analytics at the bottom */}
            <Floating_Share_Btn />
            <Floating_Go_Back_Btn />
            <Scroll_To_Top /> 
            {/* <Floating_Donate_Me /> */}

    </Router>

  )
}

export default App
