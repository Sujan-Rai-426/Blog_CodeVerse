import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";
import { usePreviousPage } from "../context/Previous_Page_Context";
import './assets/css/Floating_Go_Back_Btn.css';

const Floating_Go_Back_Btn = ({ isShareExpanded }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { historyStack, pushPage, popPage } = usePreviousPage();

    const isDisabled = location.pathname === "/" || isShareExpanded;

    // Track only real page visits, ignoring internal ID changes
    useEffect(() => {
        const current = location.pathname;

        // Extract "base path" ignoring dynamic IDs
        const basePath = current.split("/")[1]; // e.g., Frontend_Tutorial_Solution
        const last = historyStack[historyStack.length - 1] || "";
        const lastBase = last.split("/")[1] || "";

        // Only push if base path changes
        if (basePath !== lastBase) {
            pushPage(current);
        }
        // eslint-disable-next-line
    }, [location.pathname]);

    const handleGoBack = () => {
        if (isDisabled) return;

        const previous = popPage(); // get last visited page
        navigate(previous || "/");
    };

    return (
        <button
            onClick={handleGoBack}
            className={`floating-go-back ${isDisabled ? "disabled" : ""}`}
            disabled={isDisabled}
        >
            <ArrowLeftCircle size={28} />
        </button>
    );
};

export default Floating_Go_Back_Btn;
