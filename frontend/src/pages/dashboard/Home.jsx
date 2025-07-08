import {
  ArrowLeft,
  File,
  Folder,
  FolderPlus,
  Grid,
  List,
  MoreVertical,
  Search,
  Share2,
  Trash2,
  Upload,
} from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        throw new Error('No authentication token found');
      }

      const params = new URLSearchParams(location.search);
      const parentFolder = currentFolder?._id || params.get('parentFolder') || null;
      if (parentFolder) params.set('parentFolder', parentFolder);
      if (searchQuery) params.set('query', searchQuery);

      const url = searchQuery
        ? `${API_URL}/files/search?${params.toString()}`
        : `${API_URL}/files${parentFolder ? `?parentFolder=${parentFolder}` : ''}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
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
          return;
        }
        if (response.status === 404) {
          setItems([]);
          setLoading(false);
          return;
        }
        throw new Error('Failed to fetch items');
      }

      const result = await response.json();
      setItems(result.items || []);
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
      setCurrentFolder({ _id: folderId });
    }
    fetchItems();
  }, [location.search, searchQuery]);

  const handleSearch = () => {
    const params = new URLSearchParams(location.search);
    if (searchQuery) {
      params.set('query', searchQuery);
    } else {
      params.delete('query');
    }
    navigate(`/dashboard/home?${params.toString()}`);
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/files/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  const getIcon = (item, size = 'w-6 h-6') => {
    if (item.type === 'folder') return <Folder className={`${size} text-blue-500`} />;
    switch (item.fileType) {
      case 'image':
        return <img src={item.url} alt={item.name} className={`${size} object-cover rounded`} />;
      case 'video':
        return <File className={`${size} text-red-500`} />;
      case 'audio':
        return <File className={`${size} text-green-500`} />;
      case 'document':
        return <File className={`${size} text-gray-500`} />;
      default:
        return <File className={`${size} text-gray-500`} />;
    }
  };

  const getFileTypeColor = item => {
    if (item.type === 'folder')
      return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    switch (item.fileType) {
      case 'image':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      case 'video':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'audio':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'document':
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const toggleDropdown = itemId => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  const handleItemClick = item => {
    if (item.type === 'folder') {
      handleOpenFolder(item);
    } else if (item.url) {
      window.open(item.url.startsWith('http') ? item.url : `${API_URL}/${item.url}`, '_blank');
    } else {
      toast.error('File URL not available', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {currentFolder && (
                <button
                  onClick={handleNavigateBack}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentFolder
                    ? currentFolder.name
                    : location.search.includes('query')
                      ? 'Search Results'
                      : 'My Files'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Search files..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => setShowUploadFile(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
              >
                <Upload className="w-5 h-5" />
                Upload
              </button>
              <button
                onClick={() => setShowCreateFolder(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
              >
                <FolderPlus className="w-5 h-5" />
                New Folder
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <Folder className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No files or folders found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by uploading a file or creating a new folder.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowUploadFile(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
              >
                <Upload className="w-5 h-5" />
                Upload File
              </button>
              <button
                onClick={() => setShowCreateFolder(true)}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
              >
                <FolderPlus className="w-5 h-5" />
                Create Folder
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {items.map(item => (
                  <div
                    key={item._id}
                    className={`relative group p-4 rounded-xl border-2 hover:shadow-lg transition-all duration-200 cursor-pointer ${getFileTypeColor(item)}`}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex flex-col items-center">
                      <div className="mb-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        {getIcon(item, 'w-10 h-10')}
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white text-center line-clamp-2 mb-2">
                        {item.name}
                      </h3>
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        <div>{item.type === 'folder' ? 'Folder' : item.fileType || 'File'}</div>
                        {item.size && <div className="mt-1">{formatSize(item.size)}</div>}
                        <div className="mt-1">{new Date(item.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="relative">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            toggleDropdown(item._id);
                          }}
                          className="p-1 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>

                        {activeDropdown === item._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                            <div className="py-1">
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  setShareItem(item);
                                  setActiveDropdown(null);
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Share2 className="w-4 h-4" />
                                Share
                              </button>
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  handleDelete(item._id);
                                  setActiveDropdown(null);
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {items.map(item => (
                        <tr
                          key={item._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleItemClick(item)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {getIcon(item)}
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {item.type === 'folder' ? 'Folder' : item.fileType || 'File'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {formatSize(item.size)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  setShareItem(item);
                                }}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                title="Share"
                              >
                                <Share2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  handleDelete(item._id);
                                }}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
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
  );
};

export default Home;
