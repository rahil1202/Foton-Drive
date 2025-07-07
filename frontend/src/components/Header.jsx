import { ChevronDown, LogOut, Moon, Settings, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

import { useAuth } from '../context/authContext';
import { useTheme } from '../context/themeContext';

const Header = ({ title = 'Dashboard', description = '', className = '', icon = null }) => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({
    username: 'User',
    id: '1236985254',
    email: 'user@gmail.com',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const endpoint = `${BASE_URL}/user/my-profile`;
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch user data: ${response.status} ${errorText}`);
        }

        const result = await response.json();
        const data = result.employee || result.admin || result || {};

        setUserData({
          username: data.name || data.username || 'User',
          id: data._id || '',
          email: data.email || 'user@example.com',
        });
      } catch (err) {
        toast.error(err.message, { position: 'top-right', autoClose: 3000 });
        setUserData({
          username: 'User',
          id: '',
          email: 'user@example.com',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [BASE_URL]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownOpen && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleSettings = e => {
    e.stopPropagation();
    setDropdownOpen(false);
    navigate('/dashboard/settings', { state: { userData } });
  };

  const handleLogout = e => {
    e.stopPropagation();
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header
      className={twMerge(
        'w-full px-4 sm:px-6 py-5 flex items-center justify-between bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-md rounded-xl mb-6 transition-all duration-300',
        className
      )}
    >
      <div className="flex items-center gap-3 group">
        {icon && (
          <div className="text-inherit transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold transition-colors duration-300">{title}</h1>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <div className="relative">
            <Sun
              className={`w-5 h-5 text-yellow-400 absolute transition-all duration-500 ${
                theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
              }`}
            />
            <Moon
              className={`w-5 h-5 text-indigo-500 transition-all duration-500 ${
                theme === 'dark' ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
              }`}
            />
          </div>
        </button>

        <div className="relative dropdown-container">
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold uppercase shadow-inner">
              {isLoading ? '...' : userData.username.charAt(0)}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-base font-medium transition-colors duration-300">
                {isLoading ? 'Loading...' : userData.username}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                {userData.email}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform duration-300 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-300">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
                <p className="text-base font-semibold">{userData.username}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                  {userData.email}
                </p>
              </div>
              <ul className="py-2 text-sm">
                <li>
                  <button
                    onClick={handleSettings}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors duration-200"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Account Settings</span>
                  </button>
                </li>
                <li className="border-t border-gray-200 dark:border-gray-600 mt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 w-full text-left transition-colors duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
