import React, { useEffect, useState } from "react";
import { Coffee, CreditCard, DollarSign } from "lucide-react"; // Added icons
import "../../assets/css/Floating_Donate_Me.css";

const Floating_Donate_Me = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shake, setShake] = useState(false);
  const [paypalAmount, setPaypalAmount] = useState("");
  const [khaltiAmount, setKhaltiAmount] = useState("");

  const paypalBaseLink = "https://www.paypal.me/SujanRai140/";
  const khaltiNumber = "9805376861";

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    setShake(false); // stop shaking once clicked
  };
    // Shake every 5 seconds until clicked
  useEffect(() => {
    if (!isExpanded) {
      const interval = setInterval(() => {
        setShake(true);
        setTimeout(() => setShake(false), 500); // duration of shake
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isExpanded]);

// Handle donation logic btn
  const handlePayPalDonate = () => {
    if (!paypalAmount || isNaN(paypalAmount) || Number(paypalAmount) <= 0) {
      alert("Please enter a valid amount for PayPal.");
      return;
    }
    window.open(paypalBaseLink + paypalAmount, "_blank");
  };

  const handleKhaltiDonate = () => {
    if (!khaltiAmount || isNaN(khaltiAmount) || Number(khaltiAmount) <= 0) {
      alert("Please enter a valid amount for Khalti.");
      return;
    }
    window.open("https://khalti.com/", "_blank");
  };

  return (
    <div className="buymecoffee-container">
      <div
        className={`coffee-btn ${isExpanded ? "expanded" : ""} ${shake ? "shake" : ""}`}
        onClick={toggleExpand}
        title="Donate"
      >
        <Coffee size={24} />
      </div>


      {isExpanded && (
        <div className="coffee-options">
          <p className="m-0 p-0 text-center text-success"><b>Small Donation</b></p>
          {/* PayPal */}
          <div className="coffee-option">
            <DollarSign size={20} className="option-icon" />
            <input
              type="number"
              placeholder="Amount (PayPal)"
              value={paypalAmount}
              onChange={(e) => setPaypalAmount(e.target.value)}
            />
            <button onClick={handlePayPalDonate}>PayPal</button>
          </div>

          {/* Khalti */}
          <div className="coffee-option">
            <CreditCard size={20} className="option-icon" />
            <input
              type="number"
              placeholder="Amount (Khalti)"
              value={khaltiAmount}
              onChange={(e) => setKhaltiAmount(e.target.value)}
            />
            <button onClick={handleKhaltiDonate}>Khalti</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Floating_Donate_Me;
