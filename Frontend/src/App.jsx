import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from 'react';



import { PlayGround_Routes } from './public/playground/PlayGround_Imports.jsx';
import { Coding_Guide_Route } from './public/coding_Guide/Coding_Guide_Import.jsx';
import { Components_Route } from './public/designs/Components_Imports.jsx';
import { User_Routes } from './clients/User_Imports.jsx';
import { Admin_Routes } from './admin/Admin_Imports.jsx';
import { Template_Routes } from './public/template_Pages/Template_Imports.jsx';
import Routes_List from './routes/Routes_List.jsx';



import { adminPersistentLogin } from "./config/apiAdmin.js";
import User_API_Provider from './clients/User_API_Provider.jsx';
import { Parent_Api_Provider } from './public/Home/context/Parent_API_Provider.jsx';
import { Payment_Provider } from './payment/payment_status/Payment_Context.jsx';
import { Templates_API_Provider } from './public/template_Pages/Template_API.jsx';
import { Library_Routes } from './public/library/Library_Imports';
import {
  Nav_Bar, 
  Footer,
  Floating_Go_Back_Btn,
  Scroll_To_Top,
} from './public/Home/context/Import_Files.jsx'


import './App.css'; // Make sure your dark-mode/light-mode classes are here
import { Utility_Route } from './utility/Utiltiy_Imports.jsx';
import Library_API_Provider from './public/library/Library_API_Provider.jsx';

function App() {
  const [isDark, setIsDark] = useState(true); // Track dark/light mode
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    async function initAdmin() {
      await adminPersistentLogin();
      setAdminLoading(false);
    }
    initAdmin();
  }, []);

  if (adminLoading) return <div>Loading admin session...</div>;


  return (
    <User_API_Provider>
      <Payment_Provider>
        <Parent_Api_Provider>
          <Library_API_Provider>
                  <Router>
            {/* <div className={isDark ? 'dark-mode' : 'light-mode'}>
                    </div> */}
                    <Nav_Bar/>

                      <Routes>
                          <Route exact path='/Admin/*' element={<Admin_Routes />} />
                          <Route exact path='/User/*' element={<User_Routes />} />
                          <Route exact path="/*" element={<Routes_List />} />


                          <Route exact path="/Templates/*" 
                                element={
                                  <Templates_API_Provider>
                                      <Template_Routes />
                                  </Templates_API_Provider>
                                } 
                          />


                          <Route exact path="/Components/*" element={<Components_Route />} />
                          <Route exact path="/Code-Guide/*" element={<Coding_Guide_Route />} />
                          <Route exact path="/PlayGround/*" element={<PlayGround_Routes />} />
                          <Route exact path="/React-Utility/*" element={<Utility_Route />} />

                            {/* React Libraries [CodeVora-UI-Libraries] */}
                          <Route exact path="/react-library/*" element={<Library_Routes />} />
                      </Routes>

                    <Footer />
                    <Analytics />
                    {/* <Floating_Go_Back_Btn /> */}
                    <Scroll_To_Top />
                  </Router>
            </Library_API_Provider>
        </Parent_Api_Provider>
      </Payment_Provider>
    </User_API_Provider>
  );
}

export default App;
