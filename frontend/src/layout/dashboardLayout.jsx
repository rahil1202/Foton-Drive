import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import Header from '../components/TabHeader';

const getHeaderProps = pathname => {
  switch (pathname) {
    case '/dashboard/home':
      return { title: 'Dashboard', description: 'Manage your files and folders' };
    case '/dashboard/profile':
      return { title: 'Profile', description: 'View your account details' };
    case '/dashboard/settings':
      return { title: 'Settings', description: 'Configure your account settings' };
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
    <div className="flex min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header title={title} description={description} />
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
