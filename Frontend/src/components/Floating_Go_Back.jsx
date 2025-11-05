import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";
import '../assets/css/Floating_Go_Back.css'

const Floating_Go_Back = ({ isShareExpanded }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Conditions to disable button, disabled when in Home page '/' or share button is expanded inorder to avaoid button overlapping for smaller screen
    const isDisabled = location.pathname === "/" || isShareExpanded;

    return (
        <button
            onClick={() => !isDisabled && navigate(-1)}
            className={`floating-go-back ${isDisabled ? "disabled" : ""}`}
            disabled={isDisabled} // optional, also for accessibility
        >
            <ArrowLeftCircle size={28} />
        </button>
    );
};

export default Floating_Go_Back;
