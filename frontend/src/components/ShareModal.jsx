/* eslint-disable no-undef */
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import API_URL from '../configs/api';

const ShareModal = ({ item, onClose }) => {
  const [email, setEmail] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleShareByEmail = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/files/share/email`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: item._id, email }),
      });

      if (!response.ok) throw new Error('Failed to share by email');
      setSuccess('Item shared successfully');
      setError(null);
      setEmail('');
      toast.success('Item shared successfully', { position: 'top-right', autoClose: 3000 });
    } catch (err) {
      setError(err.message);
      setSuccess(null);
      toast.error(err.message, { position: 'top-right', autoClose: 3000 });
    }
  };

  const handleGenerateLink = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/files/share/link`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: item._id, expiresInDays: expiresInDays || undefined }),
      });

      if (!response.ok) throw new Error('Failed to generate share link');
      const result = await response.json();
      setShareLink(result.shareUrl);
      setSuccess('Share link generated');
      setError(null);
      toast.success('Share link generated', { position: 'top-right', autoClose: 3000 });
    } catch (err) {
      setError(err.message);
      setSuccess(null);
      toast.error(err.message, { position: 'top-right', autoClose: 3000 });
    }
  };

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareLink);
      setSuccess('Link copied to clipboard');
      toast.success('Link copied to clipboard', { position: 'top-right', autoClose: 3000 });
    } else {
      setError('Clipboard access not available');
      toast.error('Clipboard access not available', { position: 'top-right', autoClose: 3000 });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-card p-6 w-full max-w-md ring-1 ring-light-border dark:ring-dark-border">
        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
          Share {item.name}
        </h3>
        {error && <div className="text-danger mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <div className="mb-4">
          <label className="block text-light-text dark:text-dark-text mb-2">Share with Email</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter email"
              className="flex-1 px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text"
            />
            <button
              onClick={handleShareByEmail}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Share
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-light-text dark:text-dark-text mb-2">
            Generate Share Link
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={expiresInDays}
              onChange={e => setExpiresInDays(e.target.value)}
              placeholder="Expiration (days, optional)"
              className="flex-1 px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text"
            />
            <button
              onClick={handleGenerateLink}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Generate
            </button>
          </div>
        </div>
        {shareLink && (
          <div className="mb-4">
            <label className="block text-light-text dark:text-dark-text mb-2">Share Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Copy
              </button>
            </div>
          </div>
        )}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
