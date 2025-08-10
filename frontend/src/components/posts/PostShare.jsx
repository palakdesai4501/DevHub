import { useState } from 'react';

const PostShare = ({ post }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/posts/${post._id}`;
  const shareText = `Check out this post by ${post.name}: ${post.text.substring(0, 100)}...`;

  const shareOptions = [
    {
      name: 'Twitter',
      icon: 'fab fa-twitter',
      color: 'bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Facebook',
      icon: 'fab fa-facebook',
      color: 'bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'LinkedIn',
      icon: 'fab fa-linkedin',
      color: 'bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: 'fab fa-whatsapp',
      color: 'bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
    },
    {
      name: 'Email',
      icon: 'fas fa-envelope',
      color: 'bg-gray-500 hover:bg-gray-600',
      url: `mailto:?subject=${encodeURIComponent('Check out this post')}&body=${encodeURIComponent(shareText + ' ' + shareUrl)}`
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (url) => {
    window.open(url, '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  return (
    <>
      {/* Share Button */}
      <button
        onClick={() => setShowShareModal(true)}
        className="flex items-center space-x-1 text-gray-500 transition-colors"
        style={{ color: 'var(--color-primary)' }}
        title="Share Post"
      >
        <i className="fas fa-share-alt"></i>
        <span>Share</span>
      </button>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Share Post</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Social Media Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => handleShare(option.url)}
                  className={`${option.color} text-white p-3 rounded-lg flex items-center justify-center space-x-2 transition-colors`}
                >
                  <i className={option.icon}></i>
                  <span>{option.name}</span>
                </button>
              ))}
            </div>

            {/* Copy Link */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Copy Link
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 p-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <button
                  onClick={copyToClipboard}
                  className={`px-4 py-2 rounded-lg transition-colors text-white`}
                  style={{ background: copied ? 'var(--color-secondary)' : 'var(--color-primary)' }}
                >
                  {copied ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    <i className="fas fa-copy"></i>
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-sm mt-1" style={{ color: 'var(--color-primary)' }}>Link copied to clipboard!</p>
              )}
            </div>

            {/* QR Code (Optional) */}
            <div className="border-t pt-4 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR Code
              </label>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="text-gray-500 text-sm">
                  <i className="fas fa-qrcode text-2xl mb-2"></i>
                  <p>Scan to share</p>
                  <p className="text-xs mt-1">QR code generation coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostShare; 