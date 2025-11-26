// src/context/Admin_Data_Context.js
import { createContext, useContext, useState } from "react";

const Admin_Data_Context = createContext();
export const useAdminData = () => useContext(Admin_Data_Context);

export const Admin_Data_Provider = ({ children, initialData = {} }) => {
  const [categories] = useState(initialData.categories || []);
  const [topics] = useState(initialData.topics || []);
  const [languages] = useState(initialData.languages || []);
  const [frontendCodes] = useState(initialData.frontend_codes || []);
  const [backendSteps] = useState(initialData.backend_steps || []);
  const [backendImages] = useState(initialData.backend_images || []);
  const [templates] = useState(initialData.templates || []);
  const [templateTypes] = useState(initialData.template_types || []);
  const [loading] = useState(!initialData.categories);

  return (
    <Admin_Data_Context.Provider
      value={{
        categories,
        topics,
        languages,
        frontendCodes,
        backendSteps,
        backendImages,
        templates,
        templateTypes,
        loading,
      }}
    >
      {children}
    </Admin_Data_Context.Provider>
  );
};
