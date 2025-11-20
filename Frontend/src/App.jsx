import { BrowserRouter as Router } from 'react-router-dom';
import Scroll_To_Top from './context/Scroll_To_Top.jsx';

// For Vercel analytics
import { Analytics } from "@vercel/analytics/react"

import Nav_Bar from './components/Nav_Bar.jsx' 
import Footer from './components/Footer.jsx'
import Floating_Share_Btn from './components/Floating_Share_Btn.jsx';
import Floating_Go_Back_Btn from './components/Floating_Go_Back_Btn.jsx';
import { Payment_Provider } from './payment/payment_status/Payment_Context.jsx';
import Floating_Donate_Me from './payment/donation/Floating_Donate_Me.jsx';
import { Parent_Api_Provider } from './context/Parent_API_Provider.jsx';
import Routes_List from './routes/Routes_List.jsx';


function App() {
  return (
    <Parent_Api_Provider> {/* <---- To fetch API once by parent and use it all over the frontend to overcome repeatative api fetch*/}
          <Payment_Provider> {/* <---- For payment */}
                <Router>
                    {/* Sticky Floating share and Go back button visible on all pages */}
                    <Floating_Share_Btn />
                    <Floating_Go_Back_Btn />
                    <Floating_Donate_Me />

                    <Scroll_To_Top />  {/* <---- Default Auto Scroll to top*/}
                    <Nav_Bar />  {/* <----- Navbar */}
                    <Routes_List />  {/* <----- Main List of all Routes */}
                    <Footer />  {/* <----- Footer */}
                </Router>
                <Analytics />  {/* <--- Add Vercel Analytics at the bottom */}
          </ Payment_Provider>
    </ Parent_Api_Provider>
  )
}

export default App
