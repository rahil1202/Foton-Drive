import { File, Folder } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import API_URL from '../../configs/api';

const SharedItem = () => {
  const { id, token } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedItem = async () => {
      try {
        const response = await fetch(`${API_URL}/files/share/${id}/${token}`);
        if (!response.ok) throw new Error('Failed to access shared item');
        const result = await response.json();
        setItem(result.item);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        toast.error(err.message, { position: 'top-right', autoClose: 3000 });
        setLoading(false);
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
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">
        Shared Item: {item.name}
      </h2>
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-card p-6">
        {item.type === 'file' ? (
          <div className="flex items-center gap-2">
            {getIcon(item)}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {item.name}
            </a>
            <span>({formatSize(item.size)})</span>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              {getIcon(item)}
              <span className="text-light-text dark:text-dark-text">{item.name}</span>
            </div>
            {item.contents && item.contents.length > 0 && (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="p-3 text-left text-light-text dark:text-dark-text">Name</th>
                    <th className="p-3 text-left text-light-text dark:text-dark-text">Type</th>
                    <th className="p-3 text-left text-light-text dark:text-dark-text">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {item.contents.map(subItem => (
                    <tr key={subItem._id} className="border-b dark:border-dark-border">
                      <td className="p-3 flex items-center gap-2">
                        {getIcon(subItem)}
                        <span className="text-light-text dark:text-dark-text">{subItem.name}</span>
                      </td>
                      <td className="p-3 text-light-text dark:text-dark-text">
                        {subItem.type === 'folder' ? 'Folder' : subItem.fileType || 'File'}
                      </td>
                      <td className="p-3 text-light-text dark:text-dark-text">
                        {formatSize(subItem.size)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedItem;
