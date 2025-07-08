import { MoreVertical,Share2, Trash2 } from 'lucide-react';
import React from 'react';

import { formatSize } from '../utils/fileUtils.jsx';

const GridView = ({
  items,
  getIcon,
  getFileTypeColor,
  handleItemClick,
  activeDropdown,
  toggleDropdown,
  setShareItem,
  handleDelete,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {items.map(item => (
        <div
          key={item._id}
          className={`relative group p-4 rounded-xl border-2 hover:shadow-lg transition-all duration-200 cursor-pointer ${getFileTypeColor(item)}`}
          onClick={() => handleItemClick(item)}
        >
          <div className="flex flex-col items-center">
            <div className="mb-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              {getIcon(item)}
            </div>
            <h3 className="text-sm font-medium text-wrap text-gray-900 dark:text-white text-center line-clamp-2 mb-2">
              {item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}
            </h3>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <div>{item.type === 'folder' ? 'Folder' : item.fileType || 'File'}</div>
              {item.size && <div className="mt-1">{formatSize(item.size)}</div>}
              <div className="mt-1">{new Date(item.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

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
                        toggleDropdown(null);
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
                        toggleDropdown(null);
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
  );
};

export default GridView;
