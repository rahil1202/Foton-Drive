import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import DashboardLayout from '../layout/dashboardLayout';
import ConfirmRegistration from '../pages/auth/confirmRegistration';
import ForgotPassword from '../pages/auth/forgotPassword';
import Login from '../pages/auth/login';
import ResetPassword from '../pages/auth/resetPassword';
import Signup from '../pages/auth/signup';
import VerifyOtp from '../pages/auth/verifyOtp';
import DashboardHome from '../pages/dashboard/home';
import DashboardProfile from '../pages/dashboard/profile';
import Home from '../pages/home';
import ProtectedRoute from './protectedRoute';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/confirm-registration" element={<ConfirmRegistration />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Nested Routes for Dashboard */}
        <Route path="home" element={<DashboardHome />} />
        <Route path="profile" element={<DashboardProfile />} />
        <Route path="settings" element={<h1>Dashboard Settings</h1>} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRouter;
