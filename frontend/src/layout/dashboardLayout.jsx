import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const getHeaderProps = pathname => {
  switch (pathname) {
    case '/dashboard/':
      return { title: 'Dashboard', description: 'Welcome to your dashboard' };
    case '/dashboard/home':
      return { title: 'Dashboard', description: 'Manage your files and folders' };
    case '/dashboard/profile':
      return { title: 'Profile', description: 'View your account details' };
    case '/dashboard/settings':
      return { title: 'Settings', description: 'Configure your account settings' };
    case '/new-file':
      return { title: 'New File', description: 'Create a new file' };
    case '/new-folder':
      return { title: 'New Folder', description: 'Create a new folder' };
    case '/upload-file':
      return { title: 'Upload File', description: 'Upload a new file' };
    case '/upload-folder':
      return { title: 'Upload Folder', description: 'Upload a new folder' };
    default:
      return { title: 'Dashboard', description: '' };
  }
};

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const location = useLocation();
  const { title, description } = getHeaderProps(location.pathname);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen && window.innerWidth >= 768 ? 'ml-64' : 'ml-16'
        }`}
      >
        <Header title={title} description={description} />
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
