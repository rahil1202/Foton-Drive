/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { File, Folder, Plus, Share2, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import CreateFolderModal from '../../components/CreateFolderModal';
import ShareModal from '../../components/ShareModal';
import UploadFileModal from '../../components/UploadFileModal';
import API_URL from '../../configs/api';

const Home = () => {
  const [items, setItems] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [shareItem, setShareItem] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        throw new Error('No authentication token found');
      }

      const params = new URLSearchParams(location.search);
      const parentFolder = currentFolder?._id || null;
      if (parentFolder) params.set('parentFolder', parentFolder);

      const url =
        params.get('query') || params.get('fileType')
          ? `${API_URL}/files/search?${params.toString()}`
          : `${API_URL}/files${parentFolder ? `?parentFolder=${parentFolder}` : ''}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
          toast.error('Session expired. Please log in again.', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
        throw new Error('Failed to fetch items');
      }

      const result = await response.json();
      setItems(result.items);

      if (parentFolder) {
        const folderResponse = await fetch(`${API_URL}/files/folder-details/${parentFolder}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!folderResponse.ok) throw new Error('Failed to fetch folder details');
        const folderResult = await folderResponse.json();
        setCurrentFolder(folderResult.folder);
      } else {
        setCurrentFolder(null);
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      toast.error(err.message, { position: 'top-right', autoClose: 3000 });
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const folderId = params.get('parentFolder');
    if (folderId !== currentFolder?._id) {
      setCurrentFolder({ _id: folderId }); // Placeholder to trigger re-render
    }
    fetchItems();
  }, [location.search]);

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/files/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to delete item');
        setItems(items.filter(item => item._id !== id));
        toast.success('Item deleted successfully', { position: 'top-right', autoClose: 3000 });
      } catch (err) {
        toast.error(err.message, { position: 'top-right', autoClose: 3000 });
      }
    }
  };

  const handleOpenFolder = folder => {
    const params = new URLSearchParams();
    if (folder?._id) params.set('parentFolder', folder._id);
    navigate(`/dashboard/home?${params.toString()}`);
  };

  const handleNavigateBack = () => {
    setCurrentFolder(null);
    navigate('/dashboard/home');
  };

  const formatSize = bytes => {
    if (!bytes) return '-';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const getIcon = item => {
    if (item.type === 'folder') return <Folder className="w-6 h-6 text-blue-500" />;
    switch (item.fileType) {
      case 'image':
        return <img src={item.url} alt={item.name} className="w-6 h-6 object-cover" />;
      case 'video':
        return <File className="w-6 h-6 text-red-500" />;
      case 'audio':
        return <File className="w-6 h-6 text-green-500" />;
      case 'document':
        return <File className="w-6 h-6 text-gray-500" />;
      default:
        return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  if (loading)
    return <div className="text-center text-light-text dark:text-dark-text">Loading...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
          {currentFolder ? currentFolder.name : location.search ? 'Search Results' : 'My Files'}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowUploadFile(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Plus className="w-5 h-5" />
            New File
          </button>
          <button
            onClick={() => setShowCreateFolder(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Plus className="w-5 h-5" />
            New Folder
          </button>
        </div>
      </div>
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-3 text-left text-light-text dark:text-dark-text">Name</th>
              <th className="p-3 text-left text-light-text dark:text-dark-text">Type</th>
              <th className="p-3 text-left text-light-text dark:text-dark-text">Size</th>
              <th className="p-3 text-left text-light-text dark:text-dark-text">Created</th>
              <th className="p-3 text-left text-light-text dark:text-dark-text">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500 dark:text-gray-400 italic">
                  📂 No files or folders found. Please upload a file or create a new folder.
                </td>
              </tr>
            ) : (
              items.map(item => (
                <tr
                  key={item._id}
                  className="border-b dark:border-dark-border hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-3 flex items-center gap-2">
                    {getIcon(item)}
                    <button
                      onClick={() => {
                        if (item.type === 'folder') {
                          handleOpenFolder(item);
                        } else if (item.url) {
                          window.open(
                            item.url.startsWith('http') ? item.url : `${API_URL}/${item.url}`,
                            '_blank'
                          );
                        } else {
                          toast.error('File URL not available');
                        }
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      {item.name}
                    </button>
                  </td>
                  <td className="p-3 text-light-text dark:text-dark-text">
                    {item.type === 'folder' ? 'Folder' : item.fileType || 'File'}
                  </td>
                  <td className="p-3 text-light-text dark:text-dark-text">
                    {formatSize(item.size)}
                  </td>
                  <td className="p-3 text-light-text dark:text-dark-text">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => setShareItem(item)}
                      className="text-blue-500 hover:text-blue-600"
                      title="Share"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showUploadFile && (
        <UploadFileModal
          currentFolder={currentFolder}
          onClose={() => setShowUploadFile(false)}
          onSuccess={() => fetchItems()}
        />
      )}
      {showCreateFolder && (
        <CreateFolderModal
          currentFolder={currentFolder}
          onClose={() => setShowCreateFolder(false)}
          onSuccess={() => fetchItems()}
        />
      )}
      {shareItem && <ShareModal item={shareItem} onClose={() => setShareItem(null)} />}
    </div>
  );
};

export default Home;
