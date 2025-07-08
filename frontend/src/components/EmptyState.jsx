import { Folder, FolderPlus,Upload } from 'lucide-react';
import React from 'react';

const EmptyState = ({ setShowUploadFile, setShowCreateFolder }) => {
  return (
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
  );
};

export default EmptyState;
