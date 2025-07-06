import 'react-toastify/dist/ReactToastify.css';

import { Moon, Sun } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import API_URL from '../../configs/api';
import { useTheme } from '../../context/themeContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const validateName = (value, newErrors) => {
    if (!value) newErrors.name = 'Name is required';
    else delete newErrors.name;
    return newErrors;
  };

  const validateEmail = (value, newErrors) => {
    if (!value) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
      newErrors.email = 'Invalid email address';
    } else {
      delete newErrors.email;
    }
    return newErrors;
  };

  const validatePhoneNumber = (value, newErrors) => {
    if (!value) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(value)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    } else {
      delete newErrors.phoneNumber;
    }
    return newErrors;
  };

  const validatePassword = (value, newErrors) => {
    if (!value) {
      newErrors.password = 'Password is required';
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
    ) {
      newErrors.password =
        'Password must be at least 8 characters, include uppercase, lowercase, number, and a symbol';
    } else {
      delete newErrors.password;
    }
    return newErrors;
  };

  const validateField = (field, value) => {
    let newErrors = { ...errors };

    switch (field) {
      case 'name':
        newErrors = validateName(value, newErrors);
        break;
      case 'email':
        newErrors = validateEmail(value, newErrors);
        break;
      case 'phoneNumber':
        newErrors = validatePhoneNumber(value, newErrors);
        break;
      case 'password':
        newErrors = validatePassword(value, newErrors);
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      validateField(key, formData[key]);
      if (!formData[key]) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Signup successful! Redirecting to OTP verification...');
        console.log('Navigating to confirm-otp with email:', formData.email);
        navigate('/confirm-registration', { state: { email: formData.email } });
      } else {
        const errorData = await response.json();
        setErrors({ apiError: errorData.message || 'Something went wrong' });
        toast.error(errorData.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setErrors({ apiError: 'Network error. Please try again later.' });
      toast.error('Network error. Please try again later.: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
    validateField(name, value);
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
        autoComplete="on"
      >
        <h2 className="text-3xl font-extrabold text-center text-primary mb-6">
          Create Your Account
        </h2>

        {errors.apiError && <p className="text-danger text-center mb-4">{errors.apiError}</p>}

        <div className="mb-6">
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.name ? 'border-danger' : 'border-light-border dark:border-dark-border'
            } rounded-md bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text placeholder-light-text placeholder-opacity-50 dark:placeholder-dark-text focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
            placeholder="Enter your name"
            autoComplete="name"
          />
          {errors.name && <p className="mt-1 text-sm text-danger">{errors.name}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.email ? 'border-danger' : 'border-light-border dark:border-dark-border'
            } rounded-md bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text placeholder-light-text placeholder-opacity-50 dark:placeholder-dark-text focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
            placeholder="Enter your email"
            autoComplete="email"
          />
          {errors.email && <p className="mt-1 text-sm text-danger">{errors.email}</p>}
        </div>

        <div className="mb-6">
          <label            
            className="block text-sm font-medium text-light-text dark:text-dark-text mb-2"
          >
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.phoneNumber ? 'border-danger' : 'border-light-border dark:border-dark-border'
            } rounded-md bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text placeholder-light-text placeholder-opacity-50 dark:placeholder-dark-text focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
            placeholder="Enter your phone number"
            autoComplete="tel"
          />
          {errors.phoneNumber && <p className="mt-1 text-sm text-danger">{errors.phoneNumber}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.password ? 'border-danger' : 'border-light-border dark:border-dark-border'
            } rounded-md bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text placeholder-light-text placeholder-opacity-50 dark:placeholder-dark-text focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
            placeholder="Enter your password"
            autoComplete="new-password"
          />
          {errors.password && <p className="mt-1 text-sm text-danger">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-primary-light transition-all ${
            isLoading ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {isLoading ? 'Submitting...' : 'Sign Up'}
        </button>

        <p className="text-center text-sm text-light-text dark:text-dark-text mt-6 opacity-70">
          Already have an account?{' '}
          <a href="/login" className="text-primary hover:underline font-medium">
            Log In
          </a>
        </p>
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

export default Signup;
