import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import API_URL from '../configs/api';

const CreateFolderModal = ({ currentFolder, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [parentFolder, setParentFolder] = useState(currentFolder?._id || '');
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/files?type=folder`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch folders');
        const result = await response.json();
        setFolders(result.items.filter(item => item.type === 'folder'));
      } catch (err) {
        setError(err.message);
        toast.error(err.message, { position: 'top-right', autoClose: 3000 });
      }
    };
    fetchFolders();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/files/create-folder`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, parentFolder: parentFolder || null }),
      });

      if (!response.ok) throw new Error('Failed to create folder');
      setSuccess('Folder created successfully');
      toast.success('Folder created successfully', { position: 'top-right', autoClose: 3000 });
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
      toast.error(err.message, { position: 'top-right', autoClose: 3000 });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-card p-6 w-full max-w-md ring-1 ring-light-border dark:ring-dark-border">
        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
          Create Folder
        </h3>
        {error && <div className="text-danger mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-light-text dark:text-dark-text mb-2">Folder Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-light-text dark:text-dark-text mb-2">
              Select Parent Folder (Optional)
            </label>
            <select
              value={parentFolder}
              onChange={e => setParentFolder(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text"
            >
              <option value="">Root</option>
              {folders.map(folder => (
                <option key={folder._id} value={folder._id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Create Folder
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderModal;
