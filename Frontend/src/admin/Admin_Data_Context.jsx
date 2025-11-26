
// THIS DISTRIBUT DATA TO ALL PAGES OF ADMIN FROM LOCAL STORAGE CACHED

import { createContext, useContext, useState } from "react";

const Admin_Data_Context = createContext();
export const useAdminData = () => useContext(Admin_Data_Context);

export const Admin_Data_Provider = ({ children, initialData = {} }) => {

  const [adminData] = useState({
    categories: initialData.categories || [],
    topics: initialData.topics || [],
    languages: initialData.languages || [],
    frontend_codes: initialData.frontend_codes || [],
    backend_steps: initialData.backend_steps || [],
    backend_images: initialData.backend_images || [],
    templates: initialData.templates || [],
    template_types: initialData.template_types || [],
  });

  const loading = !initialData.categories;

  return (
    <Admin_Data_Context.Provider value={{ adminData, loading }}>
      {children}
    </Admin_Data_Context.Provider>
  );
};
