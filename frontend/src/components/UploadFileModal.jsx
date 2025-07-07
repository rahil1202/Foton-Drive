/* eslint-disable no-undef */
import { UploadCloud,X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

import API_URL from '../configs/api';

const UploadFileModal = ({ currentFolder, onClose, onSuccess }) => {
  const [parentFolder, setParentFolder] = useState(currentFolder?._id || '');
  const [folders, setFolders] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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

  // Get file type for display
  const getFileType = mimeType => {
    if (!mimeType) return 'Other';
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Audio';
    if (
      mimeType.includes('pdf') ||
      mimeType.includes('document') ||
      mimeType.includes('msword') ||
      mimeType.includes('officedocument') ||
      mimeType.includes('wordprocessingml') ||
      mimeType.includes('vnd.openxmlformats-officedocument') ||
      mimeType.includes('vnd.ms-excel')
    )
      return 'Document';
    return 'Other';
  };

  // Format file size
  const formatSize = bytes => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  // Handle file drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.png'],
      'video/*': ['.mp4'],
      'audio/*': ['.mp3'],
    },
    onDrop: acceptedFiles => {
      setError(null);
      setSuccess(null);
      setSelectedFiles(
        acceptedFiles.map(file => ({
          file,
          name: file.name,
          type: getFileType(file.type),
          size: file.size,
          id: Math.random().toString(36).substr(2, 9), // Unique ID for progress tracking
        }))
      );
    },
  });

  // Handle file upload with progress
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('No files selected');
      toast.error('No files selected', { position: 'top-right', autoClose: 3000 });
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress({});

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing');

      for (const fileObj of selectedFiles) {
        const formData = new FormData();
        formData.append('file', fileObj.file);
        if (parentFolder) formData.append('parentFolder', parentFolder);

        const xhr = new XMLHttpRequest();
        const promise = new Promise((resolve, reject) => {
          xhr.upload.onprogress = event => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(prev => ({
                ...prev,
                [fileObj.id]: percent,
              }));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.response));
            } else {
              let errorMessage = 'Failed to upload file';
              try {
                const errorData = JSON.parse(xhr.response);
                errorMessage = errorData.message || errorMessage;
              } catch (e) {
                errorMessage = `Error: ${xhr.status} - ${xhr.statusText}`;
                console.error('Error parsing response:', e);                
              }
              reject(new Error(errorMessage));
            }
          };

          xhr.onerror = () => reject(new Error('Network error during upload'));

          xhr.open('POST', `${API_URL}/files/upload-file`, true);
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.send(formData);
        });

        try {
          await promise;
          setUploadProgress(prev => ({
            ...prev,
            [fileObj.id]: 100,
          }));
        } catch (err) {
          setError(err.message);
          toast.error(`Failed to upload ${fileObj.name}: ${err.message}`, {
            position: 'top-right',
            autoClose: 3000,
          });
          setIsUploading(false);
          return;
        }
      }

      setSuccess('All files uploaded successfully');
      toast.success('All files uploaded successfully', { position: 'top-right', autoClose: 3000 });
      setTimeout(() => {
        setSelectedFiles([]);
        setUploadProgress({});
        setIsUploading(false);
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
      toast.error(err.message, { position: 'top-right', autoClose: 3000 });
      setIsUploading(false);
    }
  };

  // Clear selected files
  const clearFiles = () => {
    setSelectedFiles([]);
    setUploadProgress({});
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-card p-6 w-full max-w-lg ring-1 ring-light-border dark:ring-dark-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
            Upload Files
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <div
          {...getRootProps()}
          className={`cursor-pointer border-2 border-dashed border-light-border dark:border-dark-border rounded-md p-6 text-center mb-4 ${
            isDragActive ? 'bg-gray-100 dark:bg-gray-700' : ''
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input {...getInputProps()} id="hidden-upload" className="hidden" />
          <UploadCloud className="w-10 h-10 mx-auto mb-2 text-blue-500" />
          <p className="text-light-text dark:text-dark-text">
            {isDragActive
              ? 'Drop the files here'
              : 'Drag and drop files here, or click to select files'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Supported formats: PDF, JPG, PNG, MP4, MP3
          </p>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-light-text dark:text-dark-text mb-2">
              Selected Files
            </h4>
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {selectedFiles.map(fileObj => (
                <li
                  key={fileObj.id}
                  className="flex items-center justify-between text-sm text-light-text dark:text-dark-text"
                >
                  <div>
                    <span className="font-medium">{fileObj.name}</span>
                    <span className="ml-2 text-gray-500 dark:text-gray-400">
                      ({fileObj.type}, {formatSize(fileObj.size)})
                    </span>
                  </div>
                  {uploadProgress[fileObj.id] !== undefined && (
                    <div className="w-1/3">
                      <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${uploadProgress[fileObj.id] || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {uploadProgress[fileObj.id] || 0}%
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-light-text dark:text-dark-text mb-2">
            Select Parent Folder (Optional)
          </label>
          <select
            value={parentFolder}
            onChange={e => setParentFolder(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text"
            disabled={isUploading}
          >
            <option value="">Root</option>
            {folders.map(folder => (
              <option key={folder._id} value={folder._id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4">
          {selectedFiles.length > 0 && (
            <button
              onClick={clearFiles}
              className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              disabled={isUploading}
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            disabled={isUploading}
          >
            Cancel
          </button>
          {selectedFiles.length > 0 && (
            <button
              onClick={handleUpload}
              className="px-4 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFileModal;
