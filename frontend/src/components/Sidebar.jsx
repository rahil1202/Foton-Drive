import { ChevronLeft, ChevronRight, Home, LogOut, Settings, Upload, User2Icon } from 'lucide-react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth } from '../context/authContext';
import CreateFolderModal from './CreateFolderModal';
import UploadFileModal from './UploadFileModal';

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  onOpenUploadFile,
  onOpenCreateFolder,
  onItemsUpdated,
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showUploadFileModal, setShowUploadFileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleNavigation = path => {
    navigate(path);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    toast.success('Logged out successfully', { position: 'top-right', autoClose: 3000 });
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard/home', icon: <Home className="w-5 h-5" />, name: 'Home' },
    { path: '/dashboard/profile', icon: <User2Icon className="w-5 h-5" />, name: 'Profile' },
    { path: '/dashboard/settings', icon: <Settings className="w-5 h-5" />, name: 'Settings' },
  ];

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 z-50 p-2 rounded-full shadow-lg bg-blue-500 dark:bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 ${
          isSidebarOpen ? 'left-64' : 'left-4'
        } md:left-4`}
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isSidebarOpen ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
      </button>

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
                onClick={() => setUploadModalOpen(true)}
                className={`flex items-center w-full px-4 py-3 ${
                  isSidebarOpen ? 'text-lg font-semibold gap-3' : 'justify-center'
                } bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all`}
                title={!isSidebarOpen ? 'Upload' : ''}
              >
                <Upload className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span>Upload</span>}
              </button>
            </li>
            <hr className="border-gray-200 dark:border-gray-600 my-4" />
            {navItems.map(item => (
              <li key={item.path} className="relative group">
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`flex px-4 py-2 text-sm rounded-md transition-colors ${
                    isSidebarOpen ? 'w-full gap-4' : 'w-fit justify-center'
                  } ${
                    location.pathname === item.path
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                      : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={!isSidebarOpen ? item.name : ''}
                >
                  {item.icon}
                  {isSidebarOpen && <span className="text-base">{item.name}</span>}
                </button>
                {!isSidebarOpen && (
                  <span className="absolute left-full ml-2 px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                    {item.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="mb-12">
            <hr className="border-gray-200 dark:border-gray-600 my-4" />
            <button
              onClick={() => setShowLogoutModal(true)}
              className={`flex items-center w-full px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/90 rounded-md transition-colors ${
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

      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm ring-1 ring-gray-200 dark:ring-gray-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Upload Options
            </h3>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setUploadModalOpen(false);
                  setShowUploadFileModal(true);
                  onOpenUploadFile(); // Notify parent (e.g., App) to sync with Home
                }}
                className="px-4 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors"
              >
                Upload File
              </button>
              <button
                onClick={() => {
                  setUploadModalOpen(false);
                  setShowCreateFolderModal(true);
                  onOpenCreateFolder(); // Notify parent to sync with Home
                }}
                className="px-4 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors"
              >
                Create Folder
              </button>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showUploadFileModal && (
        <UploadFileModal
          currentFolder={null} // Will be passed from Home or parent if needed
          onClose={() => setShowUploadFileModal(false)}
          onSuccess={() => {
            setShowUploadFileModal(false);
            onItemsUpdated(); // Trigger refresh in Home
          }}
        />
      )}

      {showCreateFolderModal && (
        <CreateFolderModal
          currentFolder={null} // Will be passed from Home or parent if needed
          onClose={() => setShowCreateFolderModal(false)}
          onSuccess={() => {
            setShowCreateFolderModal(false);
            onItemsUpdated(); // Trigger refresh in Home
          }}
        />
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm ring-1 ring-gray-200 dark:ring-dark-border">
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
