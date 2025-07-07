/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

import API_URL from '../configs/api';

const UploadFileModal = ({ currentFolder, onClose, onSuccess }) => {
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.png'],
      'video/*': ['.mp4'],
      'audio/*': ['.mp3'],
    },

    onDrop: async acceptedFiles => {
      const file = acceptedFiles[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);
      if (parentFolder) formData.append('parentFolder', parentFolder);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/files/upload-file`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload file');
        setSuccess('File uploaded successfully');
        toast.success('File uploaded successfully', { position: 'top-right', autoClose: 3000 });
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } catch (err) {
        setError(err.message);
        toast.error(err.message, { position: 'top-right', autoClose: 3000 });
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-card p-6 w-full max-w-md ring-1 ring-light-border dark:ring-dark-border">
        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
          Upload File
        </h3>
        {error && <div className="text-danger mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <div
          {...getRootProps()}
          className={`cursor-pointer border-2 border-dashed border-light-border dark:border-dark-border rounded-md p-6 text-center ${
            isDragActive ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        >
          <input {...getInputProps()} id="hidden-upload" className="hidden" />
          <p className="text-light-text dark:text-dark-text">
            {isDragActive
              ? 'Drop the file here'
              : 'Drag and drop a file here, or click to select a file'}
          </p>
        </div>

        <div className="mt-4">
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
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UploadFileModal;
