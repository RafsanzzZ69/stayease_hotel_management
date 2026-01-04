// Components
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import GuestDashboard from "./components/GuestDashboard";
import StaffDashboard from "./components/StaffDashboard";
import AdminDashboard from "./components/AdminDashboard";
import BookingPage from "./components/BookingPageNew";
import OrderFood from "./components/OrderFood";
import HousekeepingPage from "./components/HousekeepingPage";
import { Toaster } from "./components/ui/toaster";
import KitchenDashboard from "./components/KitchenDashboard";
import HousekeepingDashboard from "./components/HousekeepingDashboard";
import ReceptionDashboard from "./components/ReceptionDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext"; // 👈 import
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Mockpayment from "./components/Mockpayment";
import PaymentPage from "./components/PaymentPage"; // Import the PaymentPage component

function AppRoutes() {
  const { user, setUser, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Toaster />

      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            user && user.role ? (
              user.role === "staff" ? (
                <Navigate
                  to={
                    user.department === "kitchen"
                      ? "/kitchen-dashboard"
                      : user.department === "housekeeping"
                      ? "/housekeeping-dashboard"
                      : user.department === "reception"
                      ? "/reception-dashboard"
                      : "/staff-dashboard"
                  }
                  replace
                />
              ) : (
                <Navigate to={`/${user.role}-dashboard`} replace />
              )
            ) : (
              <HomePage />
            )
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            user && user.role ? (
              user.role === "staff" ? (
                <Navigate
                  to={
                    user.department === "kitchen"
                      ? "/kitchen-dashboard"
                      : user.department === "housekeeping"
                      ? "/housekeeping-dashboard"
                      : user.department === "reception"
                      ? "/reception-dashboard"
                      : "/staff-dashboard"
                  }
                  replace
                />
              ) : (
                <Navigate to={`/${user.role}-dashboard`} replace />
              )
            ) : (
              <LoginPage setUser={setUser} />
            )
          }
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={
            user && user.role ? (
              <Navigate to={`/${user.role}-dashboard`} replace />
            ) : (
              <SignupPage setUser={setUser} />
            )
          }
        />

        {/* Dashboards */}
        <Route path="/guest-dashboard" element={<GuestDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/order-food" element={<OrderFood />} />
        <Route path="/housekeeping" element={<HousekeepingPage />} />
        <Route path="/kitchen-dashboard" element={<KitchenDashboard />} />
        <Route path="/housekeeping-dashboard" element={<HousekeepingDashboard />} />
        <Route path="/reception-dashboard" element={<ReceptionDashboard />} />
        <Route path="/mock-payment" element={<Mockpayment />} />
        <Route path="/payment" element={<PaymentPage />} /> {/* Payment Page Route */}
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    
        <AppRoutes />
      
  );
}

export default App;
