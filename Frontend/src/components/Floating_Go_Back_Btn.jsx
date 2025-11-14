import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";
import '../assets/css/Floating_Go_Back_Btn.css';

const Floating_Go_Back_Btn = ({ isShareExpanded }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isDisabled = location.pathname === "/" || isShareExpanded;

    const handleGoBack = () => {
        if (isDisabled) return;

        // If browser history is available, go back, else go to home
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate("/"); // fallback to homepage
        }
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
