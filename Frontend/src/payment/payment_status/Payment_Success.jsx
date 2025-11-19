import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../../assets/css/Payment_esewa.css";
import Payment_Success from "../../assets/img/payment/Payment_Success.png";

const PaymentSuccess = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const dataQuery = search.get("data");
  const [data, setData] = useState({});
  const [prevUrl, setPrevUrl] = useState("/"); // default fallback

  useEffect(() => {
    if (dataQuery) {
      const resData = atob(dataQuery);
      const resObject = JSON.parse(resData);
      console.log(resObject);

      setData(resObject);
      if (resObject.prev_url) setPrevUrl(resObject.prev_url);
    }

    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate(prevUrl);
    }, 3000);

    return () => clearTimeout(timer);
  }, [dataQuery, navigate, prevUrl]);

  return (
    <div className="esewa-success-payment-container">
      <img src={Payment_Success} alt="Payment Successful" />
      <p className="esewa-success-price">Rs. {data.total_amount}</p>
      <p className="esewa-success-status">Payment Successful</p>
      <p className="redirect-msg">Redirecting to previous page...</p>
    </div>
  );
};

export default PaymentSuccess;
