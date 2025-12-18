// src/context/User_API_Context.jsx
import { createContext, useContext } from "react";

const User_API_Context = createContext(null);

export const useUserAPI = () => {
  const context = useContext(User_API_Context);
  if (!context) {
    throw new Error("useUserAPI must be used within a User_API_Provider");
  }
  return context;
};

export default User_API_Context;
