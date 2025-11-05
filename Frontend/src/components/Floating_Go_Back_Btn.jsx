import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";
import '../assets/css/Floating_Go_Back_Btn.css';

const Floating_Go_Back_Btn = ({ isShareExpanded }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [canGoBack, setCanGoBack] = useState(false);

    useEffect(() => {
        // If window.history.length > 1, we can go back
        setCanGoBack(window.history.length > 1);
    }, [location]);

    const isDisabled = !canGoBack || isShareExpanded;

    return (
        <button
            onClick={() => !isDisabled && navigate(-1)}
            className={`floating-go-back ${isDisabled ? "disabled" : ""}`}
            disabled={isDisabled}
        >
            <ArrowLeftCircle size={28} />
        </button>
    );
};

export default Floating_Go_Back_Btn;