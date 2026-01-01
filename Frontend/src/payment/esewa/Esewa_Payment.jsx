


import React from "react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";  //install uuid package first
import CryptoJS from "crypto-js";  //install crypto-js package first
import "../assets/css/Payment_esewa.css";

const Esewa_Payment = () => {
    const [formData, setformData] = useState({
        amount: "50",
        tax_amount: "0",
        total_amount: "50",
        transaction_uuid: uuidv4(),
        product_service_charge: "0",
        product_delivery_charge: "0",
        product_code: "EPAYTEST",       // <-- For Testung sandbox product code, For production use replace with actual product code

        success_url: "http://localhost:5173/Payment_Success",
        failure_url: "http://localhost:5173/Payment_Failure",
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: "",

        secret: "8gBm/:&EnhH.1/q",      // <-- For Testing sandbox secret, For production use replace with actual secret

        //fOR Testing purpose use -->    eSewa ID: 9806800001/2/3/4/5, Password/MPIN: 1122, OTP Token:123456

    });

    // generate signature function
    const generateSignature = (
        total_amount,
        transaction_uuid,
        product_code,
        secret
    ) => {
        const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
        const hash = CryptoJS.HmacSHA256(hashString, secret);
        return CryptoJS.enc.Base64.stringify(hash);
    };

    // useeffect
    useEffect(() => {
        const { total_amount, transaction_uuid, product_code, secret } = formData;
        const hashedSignature = generateSignature(
        total_amount,
        transaction_uuid,
        product_code,
        secret
        );

        setformData({ ...formData, signature: hashedSignature });
    }, [formData.amount]);

    return (
        <form
            action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
            method="POST"
            className="esewa-form"
        >
            <div className="esewa-field">
                <input
                    type="text"
                    id="amount"
                    name="amount"
                    autoComplete="off"
                    placeholder={`NPR. ${formData.amount || ''}`} // placeholder shows NPR.
                    value={formData.amount}
                    onChange={({ target }) =>
                        setformData({
                            ...formData,
                            amount: target.value,
                            total_amount: target.value,
                        })
                    }
                    required
                />
            </div>
            <input
                type="hidden"
                id="tax_amount"
                name="tax_amount"
                value={formData.tax_amount}
                required
            />
            <input
                type="hidden"
                id="total_amount"
                name="total_amount"
                value={formData.total_amount}
                required
            />
            <input
                type="hidden"
                id="transaction_uuid"
                name="transaction_uuid"
                value={formData.transaction_uuid}
                required
            />
            <input
                type="hidden"
                id="product_code"
                name="product_code"
                value={formData.product_code}
                required
            />
            <input
                type="hidden"
                id="product_service_charge"
                name="product_service_charge"
                value={formData.product_service_charge}
                required
            />
            <input
                type="hidden"
                id="product_delivery_charge"
                name="product_delivery_charge"
                value={formData.product_delivery_charge}
                required
            />
            <input
                type="hidden"
                id="success_url"
                name="success_url"
                value={formData.success_url}
                required
            />
            <input
                type="hidden"
                id="failure_url"
                name="failure_url"
                value={formData.failure_url}
                required
            />
            <input
                type="hidden"
                id="signed_field_names"
                name="signed_field_names"
                value={formData.signed_field_names}
                required
            />
            <input
                type="hidden"
                id="signature"
                name="signature"
                value={formData.signature}
                required
            />

            <div className="esewa-field">
                <input type="text" placeholder="Frist Name" />
            </div>

            <div className="esewa-field">
                <input type="text" placeholder="Last Name" />
            </div>
            <input className="esewa-btn" value={`Pay via E-Sewa`} type="submit" />
        </form>
    );
};

export default Esewa_Payment;
