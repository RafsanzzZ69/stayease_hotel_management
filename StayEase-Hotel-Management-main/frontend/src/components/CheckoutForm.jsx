
// import React, { useState } from "react";
// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { bookRoom } from "/Users/tahura/Desktop/github-Test/Hotel-UI/frontend/src/components/api/handelBookingAPI.js";
// import { useToast } from '../hooks/use-toast';

// const CheckoutForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const bookingPayload = location.state?.bookingPayload;

//   const { toast } = useToast();

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(false);

//     if (!stripe || !elements) return;

//     try {
//       // 1️⃣ Call backend to create a PaymentIntent
//       const { data } = await axios.post(
//         "http://localhost:3000/api/payment/create-payment-intent",
//         {
//           amount: bookingPayload?.amount || 5000, // use amount from payload or default
//         }
//       );

//       const clientSecret = data.clientSecret;

//       // 2️⃣ Confirm card payment
//       const cardElement = elements.getElement(CardElement);
//       const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: { card: cardElement },
//       });

//       if (error) {
//         setError(error.message);
//         toast({ title: "Payment Error", description: error.message, variant: "destructive" });
//       } else if (paymentIntent.status === "succeeded") {
//         setSuccess(true);
//         toast({ title: "Payment Successful!" });

//         // 3️⃣ Call frontend booking API
//         if (bookingPayload) {
//           try {
//             await bookRoom(bookingPayload);
//             toast({ title: "Booking Confirmed!" });
//             navigate("/guest-dashboard");
//           } catch (err) {
//             toast({
//               title: "Booking Failed",
//               description: err.message,
//               variant: "destructive",
//             });
//           }
//         }
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || err.message);
//       toast({
//         title: "Error",
//         description: err.response?.data?.error || err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: "400px", margin: "0 auto" }}>
//       <form onSubmit={handleSubmit}>
//         <h2>Enter Payment Details</h2>
//         <CardElement
//           options={{
//             style: {
//               base: { fontSize: "16px", color: "#32325d" },
//               invalid: { color: "#fa755a" },
//             },
//           }}
//         />
//         <button
//           type="submit"
//           disabled={!stripe || loading}
//           style={{
//             marginTop: "20px",
//             padding: "10px 20px",
//             backgroundColor: "#6772e5",
//             color: "white",
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           {loading ? "Processing..." : "Pay & Book"}
//         </button>
//       </form>

//       {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
//       {success && <div style={{ color: "green", marginTop: "10px" }}>Payment Successful!</div>}
//     </div>
//   );
// };

// export default CheckoutForm;



// src/components/CheckoutForm.jsx
// import React, { useState } from "react";
// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useToast } from "../hooks/use-toast";

// const CheckoutForm = ({ amount, onSuccess, title }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(false);

//     if (!stripe || !elements) return;

//     try {
//       // 1️⃣ Call backend to create a PaymentIntent
//       const { data } = await axios.post(
//         "http://localhost:3000/api/payment/create-payment-intent",
//         { amount }
//       );

//       const clientSecret = data.clientSecret;

//       // 2️⃣ Confirm card payment
//       const cardElement = elements.getElement(CardElement);
//       const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: { card: cardElement },
//       });

//       if (error) {
//         setError(error.message);
//         toast({ title: "Payment Error", description: error.message, variant: "destructive" });
//       } else if (paymentIntent.status === "succeeded") {
//         setSuccess(true);
//         toast({ title: "Payment Successful!" });

//         // 3️⃣ Call the onSuccess callback
//         if (onSuccess) {
//           try {
//             await onSuccess();
//           } catch (err) {
//             toast({
//               title: "Action Failed",
//               description: err.message,
//               variant: "destructive",
//             });
//           }
//         }
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || err.message);
//       toast({
//         title: "Error",
//         description: err.response?.data?.error || err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: "400px", margin: "0 auto" }}>
//       <form onSubmit={handleSubmit}>
//         <h2>{title || "Enter Payment Details"}</h2>
//         <CardElement
//           options={{
//             style: {
//               base: { fontSize: "16px", color: "#32325d" },
//               invalid: { color: "#fa755a" },
//             },
//           }}
//         />
//         <button
//           type="submit"
//           disabled={!stripe || loading}
//           style={{
//             marginTop: "20px",
//             padding: "10px 20px",
//             backgroundColor: "#6772e5",
//             color: "white",
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           {loading ? "Processing..." : "Pay & Confirm"}
//         </button>
//       </form>

//       {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
//       {success && <div style={{ color: "green", marginTop: "10px" }}>Payment Successful!</div>}
//     </div>
//   );
// };

// export default CheckoutForm;



// src/CheckoutForm.jsx
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../hooks/use-toast";
import { bookRoom } from "./api/handelBookingAPI";
import { orderFoodAPI } from "./api/orderFoodAPI";

const CheckoutForm = ({ amount, type, payload, title }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!stripe || !elements) return;

    try {
      // 1️⃣ Call backend to create a PaymentIntent
      const { data } = await axios.post(
        "http://localhost:3000/api/payment/create-payment-intent",
        { amount }
      );

      const clientSecret = data.clientSecret;

      // 2️⃣ Confirm card payment
      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: { card: cardElement } }
      );

      if (error) {
        setError(error.message);
        toast({
          title: "Payment Error",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent.status === "succeeded") {
        setSuccess(true);
        toast({ title: "Payment Successful!" });

        // 3️⃣ Handle action based on type
        try {
          if (type === "booking") {
            await bookRoom(payload);
            navigate("/guest-dashboard");
          } else if (type === "food") {
            await orderFoodAPI(payload);
            navigate("/guest-dashboard");
          }
        } catch (err) {
          toast({
            title: "Action Failed",
            description: err.message,
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      toast({
        title: "Error",
        description: err.response?.data?.error || err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <form onSubmit={handleSubmit}>
        <h2>{title || "Enter Payment Details"}</h2>
        <CardElement
          options={{
            style: {
              base: { fontSize: "16px", color: "#32325d" },
              invalid: { color: "#fa755a" },
            },
          }}
        />
        <button
          type="submit"
          disabled={!stripe || loading}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#6772e5",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Processing..." : "Pay & Confirm"}
        </button>
      </form>

      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
      {success && (
        <div style={{ color: "green", marginTop: "10px" }}>
          Payment Successful!
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;

