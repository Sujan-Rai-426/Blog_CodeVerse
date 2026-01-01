// WHEN ENTERING FROM LANGUAGE TO Backend_Tutorial_Topic.jsx and Frontend_Tutorial_Topic the page dont start from top due to same layout use 
// SO TO OVERCOME THAT PROBLEM Scroll_Top page is used
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Scroll_To_Top = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]); // runs every time the URL path changes

    return null;
};

export default Scroll_To_Top;
