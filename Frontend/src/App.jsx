import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Scroll_To_Top from './context/Scroll_To_Top.jsx';
import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from 'react';

import Nav_Bar from './components/Nav_Bar.jsx';
import Footer from './components/Footer.jsx';
import Floating_Go_Back_Btn from './components/Floating_Go_Back_Btn.jsx';

import Routes_List from './routes/Routes_List.jsx';
import Admin_Routes from './admin/Admin_Routes.jsx';
import User_Routes from './clients/User_Routes.jsx';
import Template_Routes from './template_Pages/Template_Routes.jsx';

import { adminPersistentLogin } from "./config/apiAdmin";
import Components_Route from './designs/Components_Route.jsx';
import Coding_Guide_Route from './coding_Guide/Coding_Guide_Route.jsx';
import User_API_Provider from './clients/User_API_Provider.jsx';
import { Parent_Api_Provider } from './context/Parent_API_Provider.jsx';
import { Payment_Provider } from './payment/payment_status/Payment_Context.jsx';
import { Templates_API_Provider } from './template_Pages/Template_API.jsx';

function App() {
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    // Persistent login for admin on page load
    async function initAdmin() {
      await adminPersistentLogin();
      setAdminLoading(false);
    }
    initAdmin();
  }, []);

  if (adminLoading) return <div>Loading admin session...</div>; // optional loader

  return (

    <User_API_Provider>
            <Payment_Provider>
        <Parent_Api_Provider>
            <Templates_API_Provider>
                  <Router>
                      <Nav_Bar />

                        <Routes>
                            <Route exact path='/Admin/*' element={<Admin_Routes />} />
                            <Route exact path='/User/*' element={<User_Routes />} />
                            <Route exact path="/*" element={<Routes_List />} />
                            <Route exact path="/Templates/*" element={<Template_Routes />} />
                            <Route exact path="/Components/*" element={<Components_Route />} />
                            <Route exact path="/Code-Guide/*" element={<Coding_Guide_Route />} />
                        </Routes>

                      <Footer />
                      <Analytics />
                      <Floating_Go_Back_Btn />
                      <Scroll_To_Top />
                  </Router>

            </Templates_API_Provider>
        </Parent_Api_Provider>
            </Payment_Provider>
    </User_API_Provider>
  );
}

export default App;
