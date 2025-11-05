import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";
import '../assets/css/Floating_Go_Back_Btn.css';

const Floating_Go_Back_Btn = ({ isShareExpanded }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Disable only on homepage or when share is expanded
    const isDisabled = location.pathname === "/" || isShareExpanded;

    return (
        <button
            onClick={() => !isDisabled && navigate(-1)}
            className={`floating-go-back ${isDisabled ? "disabled" : ""}`}
            disabled={isDisabled} // actually disables button
        >
            <ArrowLeftCircle size={28} />
        </button>
    );
};

export default Floating_Go_Back_Btn;
