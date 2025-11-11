// src/components/PaymentGateway.jsx
import React, { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-js";

const PaymentGateway = ({ amount, onPaymentSuccess }) => {
    const [mpesaLoading, setMpesaLoading] = useState(false);

    const handleMpesaPay = async () => {
        setMpesaLoading(true);
        // Example simulation (Replace with your backend Mpesa STKpush API)
        setTimeout(() => {
            setMpesaLoading(false);
            alert("&#9989;Mpesa payment successful (demo)");
            onPaymentSuccess("mpesa");
        }, 2000)
    };

    return (
        <div ClassName="space-y-4">
            <h3 classname="font-semibold text-gray-700">Select Payment Method</h3>

            {/* PayPal */}
            <PayPalScriptProvider options={{ "Client_id": import.meta.VITE_PAYPAL_ID }}>
                <PayPalButtons style={{ layout: "vertical" }}createOrder={(data, actions) =>
                    actions.order.create({
                        purchase_units: [{ amount: { value: amount.toString() } }],
                    })
                }
                onApprove={(data, actions) =>
                    actions.order.capture().then(() => {
                        alert("&#9989; PayPal payment successful!");
                    })
                }
            />
            </PayPalScriptProvider>

            {/* M-pesa */}
            <button
              onclick={handleMpesaPay}
              disabled={mpesaLoading}
              className="w-full bg-green-600 text-white py-2 round hover :bg-green-700">
                {mpesaLoading ? "Processing M-pesa..." : 'Pay Ksh ${amount} with M-Pesa'}
              </button>
        </div>
    );
};

export default PaymentGateway;