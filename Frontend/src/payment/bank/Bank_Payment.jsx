// import React from "react";

// const Bank_Payment = ({ videoId, amount, unlockVideo }) => {
//     const handleBankPayment = () => {
//         // Example: redirect user to bank payment URL
//         const bankUrl = `https://your-bank-gateway.com/pay?amount=${amount}&videoId=${videoId}`;
//         window.location.href = bankUrl;

//         // Optional: unlock video after payment success callback from your backend
//         // unlockVideo(videoId);
//     };

//     return (
//         <button className="bank-payment-btn" onClick={handleBankPayment}>
//             Pay via Bank
//         </button>
//     );
// };

// export default Bank_Payment;



import React from "react";
import { useNavigate } from "react-router-dom";

const Bank_Payment = ({ videoId, amount, unlockVideo }) => {
    const navigate = useNavigate();
    const handleBankPayment = () => {
            // Navigate to Payment Page After clicking Buy Premium Bu
        navigate("/Unavailable");
    };

    return (
        <button className="bank-payment-btn" onClick={handleBankPayment}>
            Pay via Bank
        </button>
    );
};

export default Bank_Payment;

