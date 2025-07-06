import { Navigate, Route, Routes } from 'react-router-dom';

import ConfirmRegistration from '../pages/auth/confirmRegistration';
import ForgotPassword from '../pages/auth/forgotPassword';
import Login from '../pages/auth/login';
import ResetPassword from '../pages/auth/resetPassword';
import Signup from '../pages/auth/signup';
import VerifyOtp from '../pages/auth/verifyOtp';
import Home from '../pages/home';
// import ProtectedRoute from '../routes/protectedRoute';

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

      {/* Catch-all Route for 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
