import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getCurrentUser } from "./mock";
import "./App.css";

// Components
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import GuestDashboard from "./components/GuestDashboard";
import StaffDashboard from "./components/StaffDashboard";
import AdminDashboard from "./components/AdminDashboard";
import BookingPage from "./components/BookingPage";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading StayEase...</p>
        </div>
      </div>
    );
  }

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Navigate to={`/${user.role}-dashboard`} replace /> : <HomePage />} />
          <Route path="/login" element={user ? <Navigate to={`/${user.role}-dashboard`} replace /> : <LoginPage setUser={setUser} />} />
          <Route path="/signup" element={user ? <Navigate to={`/${user.role}-dashboard`} replace /> : <SignupPage setUser={setUser} />} />
          <Route path="/booking" element={
            <ProtectedRoute allowedRoles={['guest']}>
              <BookingPage user={user} />
            </ProtectedRoute>
          } />
          <Route path="/guest-dashboard" element={
            <ProtectedRoute allowedRoles={['guest']}>
              <GuestDashboard user={user} setUser={setUser} />
            </ProtectedRoute>
          } />
          <Route path="/staff-dashboard" element={
            <ProtectedRoute allowedRoles={['staff']}>
              <StaffDashboard user={user} setUser={setUser} />
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard user={user} setUser={setUser} />
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;