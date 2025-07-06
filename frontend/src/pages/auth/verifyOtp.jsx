import 'react-toastify/dist/ReactToastify.css';

import { Moon, Sun } from 'lucide-react';
import React, { useEffect,useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import API_URL from '../../configs/api';
import { useTheme } from '../../context/themeContext';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const { theme, toggleTheme } = useTheme();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Timer effect for resend OTP
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    switch (field) {
      case 'otp':
        if (!value) {
          newErrors.otp = 'OTP is required';
        } else if (!/^\d{6}$/.test(value)) {
          newErrors.otp = 'OTP must be a 6-digit number';
        } else {
          delete newErrors.otp;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setOtp(value);
    validateField(name, value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    validateField('otp', otp);
    if (Object.keys(errors).length > 0) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      if (response.ok) {
        toast.success('OTP verified successfully! Redirecting to reset password...');
        setTimeout(() => {
          navigate('/reset-password', { state: { email } });
        }, 1500);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        toast.success('OTP resent successfully!');
        setResendTimer(60); // Start 60-second timer
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Network error. Please try again later.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      <button
        onClick={toggleTheme}
        className="absolute top-4 left-4 p-2 rounded-full bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text hover:bg-primary hover:text-white transition-colors"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-light-card dark:bg-dark-card rounded-lg shadow-card p-8 ring-1 ring-light-border dark:ring-dark-border"
      >
        <h2 className="text-3xl font-extrabold text-center text-primary mb-6">Verify OTP</h2>
        <p className="text-center text-light-text dark:text-dark-text mb-4">
          Enter the OTP sent to <strong className="text-primary">{email}</strong> for password reset
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            OTP
          </label>
          <input
            type="text"
            name="otp"
            value={otp}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.otp ? 'border-danger' : 'border-light-border dark:border-dark-border'
            } rounded-md bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text placeholder-light-text placeholder-opacity-50 dark:placeholder-dark-text focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
            placeholder="Enter 6-digit OTP"
          />
          {errors.otp && <p className="mt-1 text-sm text-danger">{errors.otp}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-primary-light transition-all ${
            isLoading ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendLoading || resendTimer > 0}
            className={`text-sm text-primary hover:underline font-medium ${
              resendLoading || resendTimer > 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
          </button>
        </div>
      </form>

      <ToastContainer
        toastClassName="bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text ring-1 ring-light-border dark:ring-dark-border"
        position="top-right"
        pauseOnHover={false}
        limit={1}
        closeOnClick={true}
        autoClose={2000}
      />
    </div>
  );
};

export default VerifyOTP;
