import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const PostBookmark = ({ post }) => {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    // Load bookmarks from localStorage
    const savedBookmarks = JSON.parse(localStorage.getItem(`bookmarks_${user._id}`) || '[]');
    setBookmarks(savedBookmarks);
    setIsBookmarked(savedBookmarks.some(bookmark => bookmark.postId === post._id));
  }, [post._id, user._id]);

  const toggleBookmark = () => {
    const newBookmarks = isBookmarked
      ? bookmarks.filter(bookmark => bookmark.postId !== post._id)
      : [
          ...bookmarks,
          {
            postId: post._id,
            postTitle: post.text.substring(0, 50) + '...',
            postAuthor: post.name,
            postDate: post.date,
            addedAt: new Date().toISOString()
          }
        ];

    setBookmarks(newBookmarks);
    setIsBookmarked(!isBookmarked);
    localStorage.setItem(`bookmarks_${user._id}`, JSON.stringify(newBookmarks));
  };

  const removeBookmark = (postId) => {
    const newBookmarks = bookmarks.filter(bookmark => bookmark.postId !== postId);
    setBookmarks(newBookmarks);
    localStorage.setItem(`bookmarks_${user._id}`, JSON.stringify(newBookmarks));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Bookmark Button */}
      <button
        onClick={toggleBookmark}
        className={`flex items-center space-x-1 transition-colors ${
          isBookmarked
            ? 'text-yellow-500 hover:text-yellow-600'
            : 'text-gray-500 hover:text-yellow-500'
        }`}
        title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
      >
        <i className={`fas fa-bookmark ${isBookmarked ? 'text-yellow-500' : ''}`}></i>
        <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
      </button>

      {/* Bookmarks Modal */}
      <button
        onClick={() => setShowBookmarks(true)}
        className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
        title="View all bookmarks"
      >
        <i className="fas fa-list"></i>
        <span>Bookmarks ({bookmarks.length})</span>
      </button>

      {showBookmarks && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">My Bookmarks</h3>
              <button
                onClick={() => setShowBookmarks(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {bookmarks.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-bookmark text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">No bookmarks yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Save posts to read them later
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.postId}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">
                        {bookmark.postTitle}
                      </h4>
                      <p className="text-sm text-gray-500">
                        by {bookmark.postAuthor} • {formatDate(bookmark.postDate)}
                      </p>
                      <p className="text-xs text-gray-400">
                        Bookmarked on {formatDate(bookmark.addedAt)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          window.open(`/posts/${bookmark.postId}`, '_blank');
                        }}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="View post"
                      >
                        <i className="fas fa-external-link-alt"></i>
                      </button>
                      <button
                        onClick={() => removeBookmark(bookmark.postId)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove bookmark"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {bookmarks.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all bookmarks?')) {
                      setBookmarks([]);
                      localStorage.setItem(`bookmarks_${user._id}`, JSON.stringify([]));
                    }
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Clear all bookmarks
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PostBookmark; 