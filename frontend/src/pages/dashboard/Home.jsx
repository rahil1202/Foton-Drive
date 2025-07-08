 
 
import debounce from 'lodash.debounce';
import React, { useCallback,useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import CreateFolderModal from '../../components/CreateFolderModal';
import EmptyState from '../../components/EmptyState';
import GridView from '../../components/GridView';
import Header from '../../components/Header';
import ListView from '../../components/ListView';
import ShareModal from '../../components/ShareModal';
import UploadFileModal from '../../components/UploadFileModal';
import API_URL from '../../configs/api';
import { formatSize, getFileTypeColor, getIcon, handleItemClick } from '../../utils/fileUtils.jsx';

const Home = () => {
  const [items, setItems] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [shareItem, setShareItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        throw new Error('No authentication token found');
      }

      const params = new URLSearchParams();
      const parentFolder =
        currentFolder?._id || new URLSearchParams(location.search).get('parentFolder') || null;
      if (parentFolder) params.set('parentFolder', parentFolder);
      if (searchQuery) params.set('query', searchQuery);
      if (fileTypeFilter) params.set('fileType', fileTypeFilter);

      const url = `${API_URL}/files/search?${params.toString()}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
          toast.error('Session expired. Please log in again.', {
            position: 'top-right',
            autoClose: 3000,
          });
          return;
        }
        if (response.status === 404) {
          setItems([]);
          setLoading(false);
          console.log('Fetch returned 404, setting items to empty');
          return;
        }
        throw new Error('Failed to fetch items');
      }

      const result = await response.json();
      console.log('Fetched items:', result.items);
      setItems(result.items || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      toast.error(err.message, { position: 'top-right', autoClose: 3000 });
      setLoading(false);
      console.error('Fetch error:', err);
    }
  }, [currentFolder, searchQuery, fileTypeFilter, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const folderId = params.get('parentFolder');
    if (folderId !== currentFolder?._id) {
      // Fetch folder details to get name
      const fetchFolderDetails = async () => {
        if (!folderId) {
          setCurrentFolder(null);
          return;
        }
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/files/${folderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const folder = await response.json();
            setCurrentFolder({ _id: folderId, name: folder.name });
          } else {
            setCurrentFolder({ _id: folderId });
          }
        } catch (err) {
          console.error('Error fetching folder details:', err);
        }
      };
      fetchFolderDetails();
    }
    fetchItems();
  }, [location.search, fetchItems]);

  const debouncedSearch = useCallback(
    debounce(() => {
      const params = new URLSearchParams(location.search);
      if (searchQuery) params.set('query', searchQuery);
      else params.delete('query');
      if (fileTypeFilter) params.set('fileType', fileTypeFilter);
      else params.delete('fileType');
      navigate(`/dashboard/home?${params.toString()}`);
    }, 500),
    [searchQuery, fileTypeFilter, navigate, location.search]
  );

  const handleSearch = () => {
    debouncedSearch();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFileTypeFilter('');
    debouncedSearch();
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/files/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete item');
        }
        setItems(items.filter(item => item._id !== id));
        toast.success('Item deleted successfully', { position: 'top-right', autoClose: 3000 });
      } catch (err) {
        toast.error(err.message, { position: 'top-right', autoClose: 3000 });
      }
    }
  };

  const toggleDropdown = itemId => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header
          currentFolder={currentFolder}
          itemsLength={items.length}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          fileTypeFilter={fileTypeFilter}
          setFileTypeFilter={setFileTypeFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          handleSearch={handleSearch}
          handleClearSearch={handleClearSearch}
          handleNavigateBack={() => setCurrentFolder(null) || navigate('/dashboard/home')}
          setShowUploadFile={setShowUploadFile}
          setShowCreateFolder={setShowCreateFolder}
          isSearching={loading && (searchQuery || fileTypeFilter)}
        />
        {loading && !searchQuery && !fileTypeFilter ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg font-medium">{error}</div>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            setShowUploadFile={setShowUploadFile}
            setShowCreateFolder={setShowCreateFolder}
          />
        ) : (
          <>
            {viewMode === 'grid' ? (
              <GridView
                items={items}
                getIcon={item => getIcon(item, 'w-10 h-10')}
                getFileTypeColor={getFileTypeColor}
                handleItemClick={item => handleItemClick(item, navigate, API_URL)}
                activeDropdown={activeDropdown}
                toggleDropdown={toggleDropdown}
                setShareItem={setShareItem}
                handleDelete={handleDelete}
              />
            ) : (
              <ListView
                items={items}
                getIcon={getIcon}
                formatSize={formatSize}
                handleItemClick={item => handleItemClick(item, navigate, API_URL)}
                setShareItem={setShareItem}
                handleDelete={handleDelete}
              />
            )}
          </>
        )}
        {showUploadFile && (
          <UploadFileModal
            currentFolder={currentFolder}
            onClose={() => setShowUploadFile(false)}
            onSuccess={fetchItems}
          />
        )}
        {showCreateFolder && (
          <CreateFolderModal
            currentFolder={currentFolder}
            onClose={() => setShowCreateFolder(false)}
            onSuccess={fetchItems}
          />
        )}
        {shareItem && <ShareModal item={shareItem} onClose={() => setShareItem(null)} />}
      </div>
    </div>
  );
};

export default Home;
