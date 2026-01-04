// // src/PaymentPage.jsx
// import React from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import CheckoutForm from "./CheckoutForm"; // we’ll create this later
// import { useLocation } from "react-router-dom";



// // Load Stripe with your publishable key
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// const PaymentPage = () => {
//     const location = useLocation();
//   return (
//     <Elements stripe={stripePromise}>
//       <CheckoutForm 
//   handleBooking={location.state?.handleBooking} 
//   bookingPayload={location.state?.bookingPayload} 
// />
//     </Elements>
//   );
// };

// export default PaymentPage;





// src/PaymentPage.jsx
// import React from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import CheckoutForm from "./CheckoutForm";
// import { useLocation } from "react-router-dom";

// // Load Stripe with your publishable key
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// const PaymentPage = () => {
//   const location = useLocation();
//   const bookingPayload = location.state?.bookingPayload;

//   return (
//     <Elements stripe={stripePromise}>
//       <CheckoutForm bookingPayload={bookingPayload} />
//     </Elements>
//   );
// };

// const PaymentPage = () => {
//   const location = useLocation();
//   const { amount, onSuccess, title } = location.state || {};

//   return (
//     <Elements stripe={stripePromise}>
//       <CheckoutForm
//         amount={amount || 5000}    // default if nothing passed
//         onSuccess={onSuccess}      // callback
//         title={title || "Payment"} // optional
//       />
//     </Elements>
//   );
// };


// export default PaymentPage;

// src/PaymentPage.jsx
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useLocation, Navigate } from "react-router-dom";

// Load Stripe with  publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
  const location = useLocation();
  const { amount, type, payload, title } = location.state || {};

  // Redirect if no data (user opened /payment directly)
  if (!amount || !type || !payload) {
    return <Navigate to="/" replace />;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        amount={amount}
        type={type}           // "booking" | "food"
        payload={payload}     // bookingPayload or foodOrderPayload
        title={title || "Payment"}
      />
    </Elements>
  );
};

export default PaymentPage;
