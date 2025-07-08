import { Download,File, Folder } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import API_URL from '../../configs/api';

const Share = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/files/share/${id}/${token}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch shared item');
        }

        const data = await response.json();
        setItem(data.item);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error(err.message, { position: 'top-right', autoClose: 3000 });
      }
    };

    fetchSharedItem();
  }, [id, token]);

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

  const getIcon = (item, size = 'w-10 h-10') => {
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

  const handleItemClick = subItem => {
    if (subItem.type === 'folder') {
      navigate(`/share/${subItem._id}/${token}`);
    } else if (subItem.url) {
      window.location.href = subItem.url;
    } else {
      toast.error('File URL not available', { position: 'top-right', autoClose: 3000 });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-500">{error}</h3>
          <button
            onClick={() => navigate('/dashboard/home')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No item found</h3>
          <button
            onClick={() => navigate('/dashboard/home')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Shared Item: {item.name}
        </h2>
        <div className="flex flex-col items-center mb-6">
          {item.fileType === 'image' && item.url ? (
            <img
              src={item.url}
              alt={item.name}
              className="max-w-full h-auto rounded-lg mb-4 max-h-96 object-contain"
            />
          ) : (
            <div className="mb-4">{getIcon(item)}</div>
          )}
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>
              <strong>Name:</strong> {item.name}
            </p>
            <p>
              <strong>Type:</strong> {item.type === 'folder' ? 'Folder' : item.fileType || 'File'}
            </p>
            {item.size && (
              <p>
                <strong>Size:</strong> {formatSize(item.size)}
              </p>
            )}
            <p>
              <strong>Created:</strong> {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {item.type === 'file' && (
          <a
            href={item.url}
            download
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
          >
            <Download className="w-5 h-5 mr-2" />
            Download
          </a>
        )}

        {item.type === 'folder' && item.contents && item.contents.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Folder Contents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {item.contents.map(subItem => (
                <div
                  key={subItem._id}
                  className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleItemClick(subItem)}
                >
                  <div className="flex items-center gap-3">
                    {getIcon(subItem, 'w-6 h-6')}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {subItem.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {subItem.type === 'folder' ? 'Folder' : subItem.fileType || 'File'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {item.type === 'folder' && (!item.contents || item.contents.length === 0) && (
          <p className="text-gray-600 dark:text-gray-400 text-center">This folder is empty</p>
        )}

        <button
          onClick={() => navigate('/dashboard/home')}
          className="mt-6 w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Share;
