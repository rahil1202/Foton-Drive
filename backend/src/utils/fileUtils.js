export const getFileType = (mimeType) => {
  if (!mimeType) return 'other';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (
    mimeType.startsWith('application/pdf') ||
    mimeType.includes('document') ||
    mimeType.includes('msword') ||
    mimeType.includes('officedocument') ||
    mimeType.includes('wordprocessingml') ||
    mimeType.includes('vnd.openxmlformats-officedocument') ||
    mimeType.includes('vnd.ms-excel') 
  )
    return 'document';
  return 'other';
};
