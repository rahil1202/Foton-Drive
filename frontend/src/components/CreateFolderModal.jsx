import { FolderPlus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import API_URL from '../configs/api';

const CreateFolderModal = ({ currentFolder, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [parentFolder, setParentFolder] = useState(currentFolder?._id || '');
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState(null);

  // Fetch folders for parent folder selection
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token missing');
        const response = await fetch(`${API_URL}/files?type=folder`, {
          headers: { Authorization: `Bearer ${token}` },
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

  // Validate folder name in real-time
  useEffect(() => {
    if (name.trim() === '') {
      setNameError('Folder name is required');
    } else if (!/^[a-zA-Z0-9\s-_]+$/.test(name.trim())) {
      setNameError(
        'Folder name can only contain letters, numbers, spaces, hyphens, or underscores'
      );
    } else if (name.trim().length > 50) {
      setNameError('Folder name cannot exceed 50 characters');
    } else {
      setNameError(null);
    }
  }, [name]);

  // Get parent folder path for display
  const getParentFolderPath = () => {
    if (!parentFolder) return 'Root';
    const parent = folders.find(folder => folder._id === parentFolder);
    return parent ? `Root > ${parent.name}` : 'Root';
  };

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault();
    if (nameError || !name.trim()) {
      setError(nameError || 'Folder name is required');
      toast.error(nameError || 'Folder name is required', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing');

      const response = await fetch(`${API_URL}/files/create-folder`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim(), parentFolder: parentFolder || null }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create folder');
      }

      setSuccess('Folder created successfully');
      toast.success('Folder created successfully', { position: 'top-right', autoClose: 3000 });
      setTimeout(() => {
        setName('');
        setParentFolder(currentFolder?._id || '');
        setIsSubmitting(false);
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
      toast.error(err.message, { position: 'top-right', autoClose: 3000 });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-card p-6 w-full max-w-md ring-1 ring-light-border dark:ring-dark-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-blue-500" />
            Create Folder
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-light-text dark:text-dark-text mb-2">Folder Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className={`w-full px-4 py-2 rounded-md border ${
                nameError ? 'border-red-500' : 'border-light-border dark:border-dark-border'
              } bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter folder name"
              required
              disabled={isSubmitting}
            />
            {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-light-text dark:text-dark-text mb-2">
              Select Parent Folder (Optional)
            </label>
            <select
              value={parentFolder}
              onChange={e => setParentFolder(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              <option value="">Root</option>
              {folders.map(folder => (
                <option key={folder._id} value={folder._id}>
                  {folder.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Path: {getParentFolderPath()}
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting || nameError}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Folder'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderModal;
