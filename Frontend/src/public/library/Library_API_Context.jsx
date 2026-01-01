import { createContext, useContext } from "react";


// create null context
export const Library_API_Context = createContext(null);

// provide value to that context 
export const use_Library_API = () => {
    const context = useContext(Library_API_Context);
    if (!context){
        throw new Error(
            "useParentAPI must be used inside Parent_API_Provider"
        )
    }
    return context;
}