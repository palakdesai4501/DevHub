import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '../../context/PostsContext';
import { useAuth } from '../../context/AuthContext';
import CommentForm from './CommentForm';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { post, loading, error, getPost, addLike, removeLike, deletePost, deleteComment } = usePosts();
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    getPost(id);
  }, [id, getPost]);

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
      navigate('/posts');
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

  if (loading) {
    return (
      <div className="container py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error.msg}</span>
          </div>
          <button 
            onClick={() => navigate('/posts')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Post Not Found</h2>
            <p className="text-gray-600 mb-4">The post you're looking for doesn't exist or has been deleted.</p>
            <button 
              onClick={() => navigate('/posts')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Back to Posts
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isLiked = post.likes.some(like => like.user === user._id);
  const isPostOwner = post.user === user._id;

  return (
    <div className="container py-20">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/posts')}
          className="mb-6 flex items-center text-blue-500 hover:text-blue-700"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Posts
        </button>

        {/* Post Content */}
        <div className="bg-white p-8 rounded-lg shadow mb-6">
          {/* Post Header */}
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
              {post.avatar ? (
                <img src={post.avatar} alt={post.name} className="w-16 h-16 rounded-full" />
              ) : (
                <span className="text-gray-600 font-semibold text-xl">{post.name?.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{post.name}</h2>
              <p className="text-gray-500">{formatDate(post.date)}</p>
            </div>
            {isPostOwner && (
              <button
                onClick={handleDeletePost}
                disabled={loading}
                className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2"
                title="Delete Post"
              >
                <i className="fas fa-trash"></i>
              </button>
            )}
          </div>

          {/* Post Text */}
          <div className="mb-6">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">{post.text}</p>
            {post.image && (
              <div className="mt-4">
                <img
                  src={post.image}
                  alt="Post"
                  className="max-w-full max-h-96 rounded-lg shadow-sm cursor-pointer"
                  onClick={() => window.open(post.image, '_blank')}
                />
              </div>
            )}
          </div>

          {/* Like and Comment Stats */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                disabled={loading}
                className={`flex items-center space-x-2 hover:text-blue-500 disabled:opacity-50 ${
                  isLiked ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                <span className="text-xl">👍</span>
                <span>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
              </button>
              <div className="flex items-center space-x-2 text-gray-500">
                <span className="text-xl">💬</span>
                <span>{post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Comments ({post.comments.length})</h3>
            <button
              onClick={() => setShowCommentForm(!showCommentForm)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              {showCommentForm ? 'Cancel' : 'Add Comment'}
            </button>
          </div>

          {/* Comment Form */}
          {showCommentForm && (
            <div className="mb-6">
              <CommentForm postId={post._id} />
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
            ) : (
              post.comments.map(comment => (
                <div key={comment._id} className="border-l-4 border-blue-500 pl-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                        {comment.avatar ? (
                          <img src={comment.avatar} alt={comment.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <span className="text-gray-600 font-semibold">{comment.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <h5 className="font-semibold">{comment.name}</h5>
                        <p className="text-gray-500 text-sm">{formatDate(comment.date)}</p>
                      </div>
                    </div>
                    {comment.user === user._id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        disabled={loading}
                        className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
                        title="Delete Comment"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail; 