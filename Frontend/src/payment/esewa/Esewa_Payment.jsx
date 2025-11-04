// import React from "react";

// const Esewa_Payment = ({ videoId, amount, unlockVideo }) => {
//     const handleEsewaPay = () => {
//         // Your actual Esewa payment link or API call
//         window.open(`https://esewa.com.np/epay/main?amt=${amount}&pid=${videoId}`, "_blank");
//     };

//     return (
//         <button className="esewa-payment-btn" onClick={handleEsewaPay}>
//             Pay with Esewa
//         </button>
//     );
// };

// export default Esewa_Payment;



import React from "react";
import { useNavigate } from "react-router-dom";

const Esewa_Payment = ({ videoId, amount, unlockVideo }) => {
    const navigate = useNavigate();
    const handleBankPayment = () => {
            // Navigate to Payment Page After clicking Buy Premium Bu
        navigate("/Unavailable");
    };

    return (
        <button className="esewa-payment-btn" onClick={handleBankPayment}>
            Pay via Bank
        </button>
    );
};

export default Esewa_Payment;
