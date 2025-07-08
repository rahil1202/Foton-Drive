/* eslint-disable no-undef */
import { Copy,Link, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import API_URL from '../configs/api';

const ShareModal = ({ item, onClose }) => {
  const [expiresInDays, setExpiresInDays] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expiresError, setExpiresError] = useState(null);

  // Validate expiresInDays in real-time
  const validateExpiresInDays = value => {
    if (value === '') return null;
    const num = parseInt(value, 10);
    if (isNaN(num) || num <= 0) return 'Expiration days must be a positive number';
    if (num > 30) return 'Expiration days cannot exceed 30';
    return null;
  };

  const handleGenerateLink = async () => {
    const validationError = validateExpiresInDays(expiresInDays);
    if (validationError) {
      setError(validationError);
      toast.error(validationError, { position: 'top-right', autoClose: 3000 });
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing');

      const response = await fetch(`${API_URL}/files/share/link`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: item._id,
          expiresInDays: expiresInDays ? parseInt(expiresInDays, 10) : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate share link');
      }

      const result = await response.json();
      setShareLink(result.shareUrl);
      setSuccess('Share link generated successfully');
      setExpiresInDays('');
      toast.success('Share link generated successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      setError(err.message);
      toast.error(err.message, { position: 'top-right', autoClose: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard
        .writeText(shareLink)
        // eslint-disable-next-line promise/always-return
        .then(() => {
          setSuccess('Link copied to clipboard');
          toast.success('Link copied to clipboard', { position: 'top-right', autoClose: 3000 });
        })
        .catch(() => {
          setError('Failed to copy link to clipboard');
          toast.error('Failed to copy link to clipboard', {
            position: 'top-right',
            autoClose: 3000,
          });
        });
    } else {
      setError('Clipboard access not available');
      toast.error('Clipboard access not available', { position: 'top-right', autoClose: 3000 });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-card p-6 w-full max-w-md ring-1 ring-light-border dark:ring-dark-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text flex items-center gap-2">
            <Link className="w-5 h-5 text-blue-500" />
            Share {item.name}
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

        <div className="mb-4">
          <label className="block text-light-text dark:text-dark-text mb-2">
            Expiration (days, optional)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={expiresInDays}
              onChange={e => {
                setExpiresInDays(e.target.value);
                setExpiresError(validateExpiresInDays(e.target.value));
              }}
              placeholder="e.g., 7"
              min="1"
              max="30"
              className={`flex-1 px-4 py-2 rounded-md border ${
                expiresError ? 'border-red-500' : 'border-light-border dark:border-dark-border'
              } bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={isSubmitting}
            />
            <button
              onClick={handleGenerateLink}
              className={`px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 ${
                isSubmitting || expiresError ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting || expiresError}
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
                  Generating...
                </>
              ) : (
                'Generate Link'
              )}
            </button>
          </div>
          {expiresError && <p className="text-red-500 text-sm mt-1">{expiresError}</p>}
        </div>

        {shareLink && (
          <div className="mb-4">
            <label className="block text-light-text dark:text-dark-text mb-2">Share Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text cursor-pointer"
                onClick={() => window.open(shareLink, '_blank')}
                title="Click to open link"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
                disabled={isSubmitting}
              >
                <Copy className="w-5 h-5" />
                Copy
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Click the link to open or copy it to share.
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          disabled={isSubmitting}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
