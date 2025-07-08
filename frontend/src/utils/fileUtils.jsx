import { File, Folder } from 'lucide-react';
import { toast } from 'react-toastify';

export const formatSize = (bytes) => {
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

export const getIcon = (item, size = 'w-6 h-6') => {
  if (item.type === 'folder') return <Folder className={`${size} text-blue-500`} />  ;
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

export const getFileTypeColor = item => {
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

export const handleItemClick = (item, navigate, API_URL) => {
  if (item.type === 'folder') {
    const params = new URLSearchParams();
    if (item._id) params.set('parentFolder', item._id);
    navigate(`/dashboard/home?${params.toString()}`);
  } else if (item.url) {
    window.open(item.url.startsWith('http') ? item.url : `${API_URL}/${item.url}`, '_blank');
  } else {
    toast.error('File URL not available', { position: 'top-right', autoClose: 3000 });
  }
};
