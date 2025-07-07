import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import API_URL from '../../configs/api';

const Profile = () => {
  const [userData, setUserData] = useState({
    username: 'User',
    id: '',
    email: 'user@example.com',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await fetch(`${API_URL}/user/my-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const result = await response.json();
        const data = result.employee || result.admin || result || {};

        setUserData({
          username: data.name || data.username || 'User',
          id: data._id || '',
          email: data.email || 'user@example.com',
        });
      } catch (err) {
        setError(err.message);
        toast.error(err.message, { position: 'top-right', autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className={`flex min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300`}>
      <div className="flex-1 p-2">
        {isLoading ? (
          <p className="text-center text-light-text dark:text-dark-text">Loading...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          <div className="max-w-md mx-auto bg-light-card dark:bg-dark-card rounded-lg shadow-card p-8 ring-1 ring-light-border dark:ring-dark-border">
            <h2 className="text-2xl font-bold text-primary mb-6">User Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                  Username
                </label>
                <p className="text-light-text dark:text-dark-text">{userData.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                  Email
                </label>
                <p className="text-light-text dark:text-dark-text">{userData.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                  User ID
                </label>
                <p className="text-light-text dark:text-dark-text">{userData.id}</p>
              </div>
            </div>
          </div>
        )}
        <ToastContainer
          toastClassName="bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text ring-1 ring-light-border dark:ring-dark-border"
          position="top-right"
          pauseOnHover={false}
          limit={1}
          closeOnClick={true}
          autoClose={3000}
        />
      </div>
    </div>
  );
};

export default Profile;
