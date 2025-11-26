// src/App.jsx or wherever your routes are defined
import { Route, Routes } from "react-router-dom";
import Admin_Login from "./Admin_Login";
import Admin_Home from "./Admin_Home";
import Admin_Add_Data from "./Admin_Add_Data";
import Admin_View_Data from "./Admin_View_Data";
import Admin_Update_Data from "./Admin_Update_Data";
import Admin_Settings from "./Admin_Settings";
import Admin_View_User from "./Admin_View_User";
import Admin_Protected_Route from "./Admin_Protected_Route";
import { Admin_API_Provider } from "./Admin_API_Provider"; 

function Admin_Routes() {
  return (
    <Routes>
      {/* Public Admin Login */}
      <Route path="/Admin_Login" element={<Admin_Login />} />

      {/* Protected Admin Routes */}
      <Route element={<Admin_Protected_Route />}>
          <Route path="/" element={ <Admin_API_Provider> <Admin_Home /> </Admin_API_Provider> } />
          <Route path="/Add" element={ <Admin_API_Provider> <Admin_Add_Data /> </Admin_API_Provider> } />
          <Route path="/View" element={ <Admin_API_Provider> <Admin_View_Data /> </Admin_API_Provider> } />
          <Route path="/Update" element={ <Admin_API_Provider> <Admin_Update_Data /> </Admin_API_Provider> } />
          <Route path="/Settings" element={ <Admin_API_Provider> <Admin_Settings /> </Admin_API_Provider> } />
          <Route path="/User_Data" element={ <Admin_API_Provider> <Admin_View_User /> </Admin_API_Provider> } />
      </Route>
    </Routes>
  );
}

export default Admin_Routes;
