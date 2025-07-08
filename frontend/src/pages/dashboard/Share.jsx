import { File, Folder } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import API_URL from '../../configs/api';

const Share = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedFile = async () => {
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
          throw new Error(errorData.message || 'Failed to fetch shared file');
        }

        const data = await response.json();
        setFile(data);
        setLoading(false);

        if (data.type === 'file' && data.url) {
          window.location.href = data.url; 
        } else if (data.type === 'folder') {
          navigate(`/dashboard/home?parentFolder=${id}`);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error(err.message, { position: 'top-right', autoClose: 3000 });
      }
    };

    fetchSharedFile();
  }, [id, token, navigate]);

  const getIcon = (file, size = 'w-10 h-10') => {
    if (file.type === 'folder') return <Folder className={`${size} text-blue-500`} />;
    switch (file.fileType) {
      case 'image':
        return <img src={file.url} alt={file.name} className={`${size} object-cover rounded`} />;
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

  if (!file) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No file found</h3>
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

  // For folders, redirect happens in useEffect; for files, auto-download happens
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">{getIcon(file)}</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{file.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {file.type === 'folder' ? 'Folder' : file.fileType || 'File'}
        </p>
        {file.type === 'file' && (
          <a
            href={file.url}
            download
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Download
          </a>
        )}
      </div>
    </div>
  );
};

export default Share;
