// import { useLocation, useNavigate } from "react-router-dom";
// import { useToast } from "@/hooks/use-toast";
// import { useState } from "react";

// const MockPaymentForm = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(false);

//   if (!state) {
//     return <p className="text-center text-red-500">No booking details provided</p>;
//   }

//   const { userId, roomTypeId, checkInDate, checkOutDate, guests, selectedRoom } = state;

//   const handleBooking = async () => {
//     setIsLoading(true);
//     const payload = {
//       userId,
//       roomTypeId,
//       checkInDate,
//       checkOutDate,
//       guests,
//     };

//     console.log("Booking Payload:", payload);

//     try {
//       const res = await fetch("http://localhost:3000/api/bookings", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Booking failed");

//       toast({
//         title: "Payment Successful 💳",
//         description: "Your booking has been confirmed!",
//         duration: 5000,
//       });

//       setTimeout(() => {
//         navigate("/guest-dashboard");
//       }, 3000);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Something went wrong";
//       toast({
//         title: "Error",
//         description: errorMessage,
//         variant: "destructive",
//         duration: 5000,
//       });

//       setTimeout(() => {
//         navigate("/guest-dashboard");
//       }, 3000);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg shadow-lg bg-white">
//       <h2 className="text-xl font-bold mb-4">Mock Payment</h2>
//       <p className="mb-4">
//         You’re paying for{" "}
//         <strong>{selectedRoom?.roomType?.roomTypeName || "Selected Room"}</strong>
//       </p>
//       <input
//         type="text"
//         placeholder="Card Number"
//         className="w-full border px-3 py-2 rounded mb-3"
//       />
//       <input
//         type="text"
//         placeholder="MM/YY"
//         className="w-full border px-3 py-2 rounded mb-3"
//       />
//       <input
//         type="text"
//         placeholder="CVC"
//         className="w-full border px-3 py-2 rounded mb-3"
//       />
//       <button
//         onClick={handleBooking}
//         disabled={isLoading}
//         className={`w-full py-2 rounded transition text-white ${
//           isLoading
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-blue-600 hover:bg-blue-700"
//         }`}
//       >
//         {isLoading ? "Processing..." : "Pay Now"}
//       </button>
//     </div>
//   );
// };

// export default MockPaymentForm;


import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const MockPaymentForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  if (!state) {
    return <p className="text-center text-red-500">No booking details provided</p>;
  }

  const { userId, roomTypeId, checkInDate, checkOutDate, guests, selectedRoom } = state;

  const handleBooking = async () => {
    if (!cardNumber || !expiry || !cvc) {
      toast({
        title: "Error",
        description: "Please fill in all card details",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const payload = { userId, roomTypeId, checkInDate, checkOutDate, guests };
    console.log("Booking Payload:", payload);

    // fake payment simulation
    setTimeout(() => {
      toast({
        title: "Payment Successful 💳",
        description: "Your booking has been confirmed!",
        duration: 5000,
      });

      navigate("/guest-dashboard");
    }, 2500);
  };

  // simple formatter for card number (adds spaces every 4 digits)
  const formatCardNumber = (value) =>
    value.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim();

  return (
    <div className="max-w-md mx-auto mt-12 p-6 rounded-xl shadow-lg bg-white border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center">Payment</h2>
      <p className="mb-6 text-center text-gray-600">
        You’re paying for{" "}
        <strong>{selectedRoom?.roomType?.roomTypeName || "Selected Room"}</strong>
      </p>

      {/* Card Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Card Number</label>
        <input
          type="text"
          maxLength={19}
          placeholder="4242 4242 4242 4242"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          className="w-full px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg tracking-widest placeholder-gray-400"
        />
      </div>

      {/* Expiry + CVC side by side */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Expiry</label>
          <input
            type="text"
            maxLength={5}
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg placeholder-gray-400"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">CVC</label>
          <input
            type="text"
            maxLength={3}
            placeholder="123"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            className="w-full px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg placeholder-gray-400"
          />
        </div>
      </div>

      {/* Pay Button */}
      <button
        onClick={handleBooking}
        disabled={isLoading}
        className={`w-full py-3 rounded-lg text-white text-lg font-semibold flex items-center justify-center transition ${
          isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          "Make Payment"
        )}
      </button>
    </div>
  );
};

export default MockPaymentForm;
