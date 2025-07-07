import { ChevronLeft, ChevronRight, Home, LogOut, Settings, Upload, User2Icon } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/authContext';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [uploadDropdownOpen, setUploadDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleNavigation = path => {
    setUploadDropdownOpen(false);
    navigate(path);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard/home', icon: <Home className="w-5 h-5" />, name: 'Home' },
    { path: '/dashboard/profile', icon: <User2Icon className="w-5 h-5" />, name: 'Profile' },
    { path: '/dashboard/settings', icon: <Settings className="w-5 h-5" />, name: 'Settings' },
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 z-50 p-2 rounded-full shadow-lg bg-blue-500 dark:bg-blue-500 text--800 dark:text-gray-200 hover:bg-blue-900 hover:text-white transition-all duration-300 ${
          isSidebarOpen ? 'left-64' : 'left-4'
        } md:left-4`}
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isSidebarOpen ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg transition-all duration-300 z-40`}
      >
        <div className="p-4 h-full flex flex-col mt-12">
          {isSidebarOpen && (
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-8">
              File System
            </h2>
          )}
          {!isSidebarOpen && (
            <div className="flex items-center justify-center h-16">
              <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400">FMS</h2>
            </div>
          )}
          <ul className="space-y-4 flex-1">
            <li className="relative group">
              <button
                onClick={() => isSidebarOpen && setUploadDropdownOpen(!uploadDropdownOpen)}
                className={`flex items-center w-full px-4 py-3 ${
                  isSidebarOpen ? 'text-lg font-semibold gap-3' : 'justify-center'
                } bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all`}
                title={!isSidebarOpen ? 'Upload' : ''}
              >
                <Upload className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span>Upload</span>}
              </button>
              {uploadDropdownOpen && isSidebarOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10">
                  <button
                    onClick={() => handleNavigation('/upload-file')}
                    className="block w-full px-4 py-2 text-sm text-left text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Upload File
                  </button>
                  <button
                    onClick={() => handleNavigation('/upload-folder')}
                    className="block w-full px-4 py-2 text-sm text-left text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Upload Folder
                  </button>
                </div>
              )}
            </li>
            <hr className="border-gray-200 dark:border-gray-600 my-4" />
            {/* Navigation Items */}
            {navItems.map(item => (
              <li key={item.path} className="relative group">
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`flex px-4 py-2 text-black dark:text-gray-200 text-sm hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md transition-colors ${
                    isSidebarOpen ? 'w-full gap-4' : 'w-fit justify-center'
                  }`}
                  title={!isSidebarOpen ? item.name : ''}
                >
                  {item.icon}
                  {isSidebarOpen && <span className="text-base">{item.name}</span>}
                </button>
              </li>
            ))}
          </ul>
          {/* Logout Section */}
          <div className="mt-auto">
            <hr className="border-gray-200 dark:border-gray-600 -mt-24 mb-4" />
            <button
              onClick={() => setShowLogoutModal(true)}
              className={`flex items-center w-full px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors ${
                isSidebarOpen ? 'gap-3' : 'justify-center'
              }`}
              title={!isSidebarOpen ? 'Logout' : ''}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm ring-1 ring-gray-200 dark:ring-gray-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Are you sure you want to logout?
            </h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
