import 'react-toastify/dist/ReactToastify.css';

import { Moon, Sun } from 'lucide-react';
import React, { useEffect,useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import API_URL from '../../configs/api';
import { useTheme } from '../../context/themeContext';

const ConfirmRegistration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const { theme, toggleTheme } = useTheme();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async e => {
    e.preventDefault();

    if (!otp) {
      toast.error('OTP is required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/confirm-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        toast.success('OTP verified successfully! Please login to continue.');
        setTimeout(() => {
          navigate('/login');
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
      const response = await fetch(`${API_URL}/auth/resend-registration-otp`, {
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
          An OTP has been sent to <strong className="text-primary"> {email} </strong>
          for your email confirmation
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            OTP
          </label>
          <input
            type="text"
            name="otp"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text placeholder-light-text placeholder-opacity-50 dark:placeholder-dark-text focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            placeholder="Enter OTP"
          />
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
        autoClose={1000}
      />
    </div>
  );
};

export default ConfirmRegistration;
