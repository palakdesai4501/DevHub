import { useState, useEffect } from 'react';
import { usePosts } from '../../context/PostsContext';
import { Link } from 'react-router-dom';

const TrendingPosts = () => {
  const { posts } = usePosts();
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    // Calculate trending posts based on engagement
    const calculateTrendingScore = (post) => {
      const likes = post.likes?.length || 0;
      const comments = post.comments?.length || 0;
      const shares = post.shares || 0;
      const views = post.views || 0;
      
      // Weight different engagement types
      const score = (likes * 2) + (comments * 3) + (shares * 4) + (views * 0.1);
      
      // Boost recent posts
      const postDate = new Date(post.date);
      const now = new Date();
      const hoursSincePosted = (now - postDate) / (1000 * 60 * 60);
      const timeBoost = Math.max(1, 24 / (hoursSincePosted + 1));
      
      return score * timeBoost;
    };

    const sortedPosts = [...posts]
      .filter(post => {
        const likes = post.likes?.length || 0;
        const comments = post.comments?.length || 0;
        return likes > 0 || comments > 0; // Only posts with engagement
      })
      .sort((a, b) => calculateTrendingScore(b) - calculateTrendingScore(a))
      .slice(0, 5); // Top 5 trending posts

    setTrendingPosts(sortedPosts);
  }, [posts]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getTrendingIcon = (index) => {
    switch (index) {
      case 0: return '🔥';
      case 1: return '⚡';
      case 2: return '💫';
      default: return '📈';
    }
  };

  if (trendingPosts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <i className="fas fa-fire text-red-500 mr-2"></i>
        Trending Posts
      </h3>
      
      <div className="space-y-3">
        {trendingPosts.map((post, index) => (
          <Link
            key={post._id}
            to={`/posts/${post._id}`}
            className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className="text-lg">{getTrendingIcon(index)}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900 truncate">
                    {post.name}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {formatDate(post.date)}
                  </span>
                </div>
                
                <p className="text-gray-700 text-sm line-clamp-2 mb-2">
                  {post.text}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <i className="fas fa-thumbs-up"></i>
                    <span>{post.likes?.length || 0}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <i className="fas fa-comment"></i>
                    <span>{post.comments?.length || 0}</span>
                  </span>
                  {post.category && (
                    <span className="px-2 py-1 rounded-full text-xs" style={{ background: 'var(--color-accent)', color: 'var(--color-primary)' }}>
                      {post.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          to="/posts"
          className="text-sm font-medium"
          style={{ color: 'var(--color-primary)' }}
        >
          View all posts →
        </Link>
      </div>
    </div>
  );
};

export default TrendingPosts; 