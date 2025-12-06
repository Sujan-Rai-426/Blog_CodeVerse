import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Scroll_To_Top from './context/Scroll_To_Top.jsx';
import { Analytics } from "@vercel/analytics/react";

import Nav_Bar from './components/Nav_Bar.jsx';
import Footer from './components/Footer.jsx';
import Floating_Go_Back_Btn from './components/Floating_Go_Back_Btn.jsx';
import Routes_List from './routes/Routes_List.jsx';
import Admin_Routes from './admin/Admin_Routes.jsx';
import User_Routes from './clients/User_Routes.jsx';
import Template_Routes from './template_Pages/Template_Routes.jsx';

function App() {

  return (
    <Router>
      <Nav_Bar />

      <Routes>
        <Route exact path='/Admin/*' element={<Admin_Routes />} />
        <Route exact path='/User/*' element={<User_Routes />} />
        <Route exact path="/Templates/*" element={<Template_Routes />} />
        <Route exact path="/*" element={<Routes_List />} />
      </Routes>

      <Footer />

      <Analytics />
      <Floating_Go_Back_Btn />
      <Scroll_To_Top />
    </Router>
  );
}

export default App;
