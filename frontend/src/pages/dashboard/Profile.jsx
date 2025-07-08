/* eslint-disable no-unused-vars */
import 'react-toastify/dist/ReactToastify.css';

import { UserPlus2Icon } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('view');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_URL}/user/profile`, {
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

      const userInfo = {
        username: data.name || data.username || 'User',
        id: data._id || '',
        email: data.email || 'user@example.com',
      };

      setUserData(userInfo);
      setProfileForm({
        username: userInfo.username,
        email: userInfo.email,
      });
    } catch (err) {
      setError(err.message);
      toast.error(err.message, { position: 'top-right', autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async e => {
    e.preventDefault();

    if (!profileForm.username.trim() || !profileForm.email.trim()) {
      toast.error('Username and email are required', { position: 'top-right', autoClose: 3000 });
      return;
    }

    try {
      setIsUpdating(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileForm.username,
          email: profileForm.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const result = await response.json();
      toast.success('Profile updated successfully!', { position: 'top-right', autoClose: 3000 });

      // Refresh user data
      await fetchUserData();
      setActiveTab('view');
    } catch (err) {
      toast.error(err.message, { position: 'top-right', autoClose: 3000 });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async e => {
    e.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.error('All password fields are required', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
      setIsUpdating(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/user/change-password`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      toast.success('Password changed successfully!', { position: 'top-right', autoClose: 3000 });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setActiveTab('view');
    } catch (err) {
      toast.error(err.message, { position: 'top-right', autoClose: 3000 });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toLowerCase() !== 'delete') {
      toast.error('Please type "DELETE" to confirm account deletion', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
      setIsUpdating(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/user/delete-account`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account');
      }

      toast.success('Account deleted successfully!', { position: 'top-right', autoClose: 3000 });

      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      toast.error(err.message, { position: 'top-right', autoClose: 3000 });
    } finally {
      setIsUpdating(false);
    }
  };

  const EditIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );

  const KeyIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
      />
    </svg>
  );

  const TrashIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );

  const BackIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'edit':
        return (
          <div className="bg-light-card dark:bg-dark-card rounded-xl shadow-card p-8 ring-1 ring-light-border dark:ring-dark-border">
            <div className="flex items-center gap-3 mb-6">
              <EditIcon />
              <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Edit Profile
              </h3>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={profileForm.username}
                  onChange={e => setProfileForm({ ...profileForm, username: e.target.value })}
                  className="w-full px-4 py-3 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('view')}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        );

      case 'password':
        return (
          <div className="bg-light-card dark:bg-dark-card rounded-xl shadow-card p-8 ring-1 ring-light-border dark:ring-dark-border">
            <div className="flex items-center gap-3 mb-6">
              <KeyIcon />
              <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Change Password
              </h3>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={e =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                  minLength="6"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={e =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                  minLength="6"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isUpdating ? 'Updating...' : 'Change Password'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('view')}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        );

      case 'delete':
        return (
          <div className="bg-light-card dark:bg-dark-card rounded-xl shadow-card p-8 ring-1 ring-light-border dark:ring-dark-border">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrashIcon />
                <h3 className="text-xl font-semibold text-red-800 dark:text-red-200">
                  ⚠️ Danger Zone
                </h3>
              </div>
              <div className="bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 rounded-lg p-4 mb-6">
                <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                  ⚠️ <strong>Warning:</strong> This action cannot be undone. This will permanently
                  delete your account and all associated data.
                </p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                  Type "DELETE" to confirm account deletion:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)}
                  className="w-full px-4 py-3 border border-red-300 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  placeholder="Type DELETE here..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isUpdating || deleteConfirmText.toLowerCase() !== 'delete'}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isUpdating ? 'Deleting...' : 'Delete Account Forever'}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('view');
                    setDeleteConfirmText('');
                  }}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Information Card */}
            <div className="bg-light-card dark:bg-dark-card rounded-xl shadow-card p-8 ring-1 ring-light-border dark:ring-dark-border">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="bg-primary/10 rounded-full p-6 mb-4">
                  <UserPlus2Icon className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
                  {userData.username}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Member since {new Date().getFullYear()}
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Username
                  </label>
                  <p className="text-lg font-semibold text-light-text dark:text-dark-text">
                    {userData.username}
                  </p>
                </div>

                <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Email Address
                  </label>
                  <p className="text-lg font-semibold text-light-text dark:text-dark-text">
                    {userData.email}
                  </p>
                </div>

                <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    User ID
                  </label>
                  <p className="text-sm font-mono text-light-text dark:text-dark-text bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded inline-block">
                    {userData.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-light-card dark:bg-dark-card rounded-xl shadow-card p-8 ring-1 ring-light-border dark:ring-dark-border">
              <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-6">
                Account Actions
              </h3>

              <div className="space-y-4">
                <button
                  onClick={() => setActiveTab('edit')}
                  className="w-full flex items-center gap-3 bg-primary text-white py-4 px-6 rounded-lg font-medium hover:bg-primary/90 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <EditIcon />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab('password')}
                  className="w-full flex items-center gap-3 bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <KeyIcon />
                  <span>Change Password</span>
                </button>

                <div className="pt-4 border-t border-light-border dark:border-dark-border">
                  <button
                    onClick={() => setActiveTab('delete')}
                    className="w-full flex items-center gap-3 bg-red-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-red-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <TrashIcon />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-bg via-light-bg to-primary/5 dark:from-dark-bg dark:via-dark-bg dark:to-primary/5 transition-all duration-300">
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              <div className="absolute top-0 left-0 animate-ping rounded-full h-16 w-16 border-2 border-primary opacity-20"></div>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={fetchUserData}
              className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-primary/90 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-light-card dark:bg-dark-card rounded-xl shadow-card p-6 mb-8 ring-1 ring-light-border dark:ring-dark-border">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-primary mb-2">Profile Settings</h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    Manage your account settings and preferences
                  </p>
                </div>
                {activeTab !== 'view' && (
                  <button
                    onClick={() => setActiveTab('view')}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-light-bg dark:hover:bg-dark-bg rounded-lg transition-all"
                  >
                    <BackIcon />
                    <span>Back to Profile</span>
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            {renderTabContent()}
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
