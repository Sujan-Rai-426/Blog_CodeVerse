
// =====For Navigating to Previous Page when click Back btn


import React, { createContext, useState, useContext } from "react";

// Create context
const Previous_Page_Context = createContext();

// Provider
export const Previous_Page_Provider = ({ children }) => {
    const [historyStack, setHistoryStack] = useState([]);

    // Add a new page to stack only if different
    const pushPage = (path) => {
        setHistoryStack((prev) => {
            if (prev[prev.length - 1] !== path) {
                return [...prev, path];
            }
            return prev;
        });
    };

    // Pop last page and return previous
    const popPage = () => {
        let last = "/";
        setHistoryStack((prev) => {
            if (prev.length > 1) {
                last = prev[prev.length - 2];
                return prev.slice(0, -1);
            }
            return prev;
        });
        return last;
    };

    return (
        <Previous_Page_Context.Provider value={{ historyStack, pushPage, popPage }}>
            {children}
        </Previous_Page_Context.Provider>
    );
};

// Hook to use in components
export const usePreviousPage = () => useContext(Previous_Page_Context);
