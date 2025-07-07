import 'react-toastify/dist/ReactToastify.css';

import { File, Folder, Search } from 'lucide-react';
import React, { useEffect,useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import API_URL from '../../configs/api';

const DashboardHome = () => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await fetch(`${API_URL}/files`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch files');
        }

        const data = await response.json();
        setFiles(data);
        setFilteredFiles(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message, { position: 'top-right', autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, []);

  useEffect(() => {
    const filtered = files.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFiles(filtered);
  }, [searchQuery, files]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={`flex min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300`}>
      <div className="flex-1 p-2">
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search files or folders..."
              className="w-full px-4 py-2 pl-10 border border-light-border dark:border-dark-border rounded-md bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text placeholder-light-text placeholder-opacity-50 dark:placeholder-dark-text focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
        {isLoading ? (
          <p className="text-center text-light-text dark:text-dark-text">Loading...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFiles.length === 0 ? (
              <p className="text-center text-light-text dark:text-dark-text col-span-full">
                No files or folders found.
              </p>
            ) : (
              filteredFiles.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 p-4 bg-light-card dark:bg-dark-card rounded-md shadow-card hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {item.type === 'folder' ? (
                    <Folder className="w-6 h-6 text-primary" />
                  ) : (
                    <File className="w-6 h-6 text-primary" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-light-text dark:text-dark-text">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.type === 'folder' ? 'Folder' : `File (${item.size || 'Unknown'})`}
                    </p>
                  </div>
                </div>
              ))
            )}
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

export default DashboardHome;