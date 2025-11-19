import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Payment_bank.css"; // reuse some styles

const Bank_Payment = ({ videoId, amount, unlockVideo }) => {
    const [formData, setFormData] = useState({
        amount: amount || "",
        name: "",
        email: "",
    });

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Example: redirect user to bank payment URL
        const bankUrl = `https://your-bank-gateway.com/pay?amount=${formData.amount}&videoId=${videoId}`;
        window.location.href = bankUrl;

        // Optional: unlock video after backend confirms payment
        // unlockVideo(videoId);
    };

    return (
        <form className="bank-payment-form" onSubmit={handleSubmit}>
            <div className="bank-field">
                <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder={`NPR ${formData.amount || ""}`}
                    required
                />
            </div>

            <div className="bank-field">
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Your Name"
                    required
                />
            </div>

            <div className="bank-field">
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Your Email"
                    required
                />
            </div>

            <button className="bank-payment-btn" type="submit">
                Pay via Bank
            </button>
        </form>
    );
};

export default Bank_Payment;
