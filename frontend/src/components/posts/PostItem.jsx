import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../../context/PostsContext';
import { useAuth } from '../../context/AuthContext';
import CommentForm from './CommentForm';
import PostShare from './PostShare';
import PostBookmark from './PostBookmark';

const PostItem = ({ post }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addLike, removeLike, deletePost, deleteComment, loading } = usePosts();
  const [showCommentForm, setShowCommentForm] = useState(false);

  const handleLike = async () => {
    const isLiked = post.likes.some(like => like.user === user._id);
    if (isLiked) {
      await removeLike(post._id);
    } else {
      await addLike(post._id);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(post._id);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(post._id, commentId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const isLiked = post.likes.some(like => like.user === user._id);
  const isPostOwner = post.user === user._id;

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-4 md:mb-6 card-animate">
      {/* Post Header */}
      <div className="flex items-center mb-3 md:mb-4">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-300 rounded-full mr-3 md:mr-4 flex items-center justify-center flex-shrink-0">
          {post.avatar ? (
            <img src={post.avatar} alt={post.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
          ) : (
            <span className="text-gray-600 font-semibold text-sm md:text-base">{post.name?.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm md:text-base truncate">{post.name}</h4>
          <p className="text-gray-500 text-xs md:text-sm">{formatDate(post.date)}</p>
        </div>
        {isPostOwner && (
          <button
            onClick={handleDeletePost}
            disabled={loading}
            className="text-red-500 hover:text-red-700 disabled:opacity-50 flex-shrink-0 ml-2"
          >
            <i className="fas fa-times text-sm md:text-base"></i>
          </button>
        )}
      </div>

      {/* Post Content */}
      <div 
        className="text-gray-700 mb-3 md:mb-4 cursor-pointer hover:text-gray-900"
        onClick={() => navigate(`/posts/${post._id}`)}
      >
        <p className="mb-3 text-sm md:text-base">{post.text}</p>
        {post.image && (
          <div className="mt-3">
            <img
              src={post.image}
              alt="Post"
              className="max-w-full max-h-64 md:max-h-96 rounded-lg shadow-sm w-full object-cover"
              onClick={(e) => {
                e.stopPropagation();
                // Open image in full screen
                window.open(post.image, '_blank');
              }}
            />
          </div>
        )}
        
        {/* Categories and Tags */}
        <div className="mt-3 flex flex-wrap items-center gap-1 md:gap-2">
          {post.category && (
            <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--color-accent)', color: 'var(--color-primary)' }}>
              {post.category}
            </span>
          )}
          {post.tags && post.tags.length > 0 && (
            post.tags.map(tag => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Post Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-500 mb-3 md:mb-4 gap-3 sm:gap-0">
        <div className="flex space-x-3 md:space-x-4">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center space-x-1 disabled:opacity-50 text-xs md:text-sm`}
            style={{ color: isLiked ? 'var(--color-primary)' : undefined }}
          >
            <span>👍</span>
            <span className="hidden sm:inline">{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
            <span className="sm:hidden">{post.likes.length}</span>
          </button>
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="flex items-center space-x-1 text-xs md:text-sm"
            style={{ color: 'var(--color-primary)' }}
          >
            <span>💬</span>
            <span className="hidden sm:inline">{post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}</span>
            <span className="sm:hidden">{post.comments.length}</span>
          </button>
        </div>
        
        <div className="flex space-x-3 md:space-x-4">
          <PostBookmark post={post} />
          <PostShare post={post} />
        </div>
      </div>

      {/* Comment Form */}
      {showCommentForm && <CommentForm postId={post._id} />}

      {/* Comments */}
      {post.comments.length > 0 && (
        <div className="space-y-2 md:space-y-3">
          <h4 className="font-semibold text-gray-700 text-sm md:text-base">Comments</h4>
          {post.comments.map(comment => (
            <div key={comment._id} className="bg-gray-50 p-2 md:p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center min-w-0 flex-1">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-300 rounded-full mr-2 flex items-center justify-center flex-shrink-0">
                    {comment.avatar ? (
                      <img src={comment.avatar} alt={comment.name} className="w-6 h-6 md:w-8 md:h-8 rounded-full" />
                    ) : (
                      <span className="text-gray-600 text-xs md:text-sm font-semibold">{comment.name?.charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-semibold text-xs md:text-sm truncate">{comment.name}</h5>
                    <p className="text-gray-500 text-xs">{formatDate(comment.date)}</p>
                  </div>
                </div>
                {comment.user === user._id && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    disabled={loading}
                    className="text-red-500 hover:text-red-700 text-xs md:text-sm disabled:opacity-50 flex-shrink-0 ml-2"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              <p className="text-gray-700 text-xs md:text-sm">{comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostItem; 