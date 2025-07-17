import { useState, useEffect } from 'react';
import { usePosts } from '../../context/PostsContext';

const PostAnalytics = ({ post }) => {
  const [analytics, setAnalytics] = useState({
    views: 0,
    likes: post.likes.length,
    comments: post.comments.length,
    shares: 0,
    engagementRate: 0
  });

  useEffect(() => {
    // Simulate analytics data - in a real app, this would come from an API
    const mockAnalytics = {
      views: Math.floor(Math.random() * 1000) + 100,
      likes: post.likes.length,
      comments: post.comments.length,
      shares: Math.floor(Math.random() * 50),
      engagementRate: ((post.likes.length + post.comments.length) / (Math.floor(Math.random() * 1000) + 100) * 100).toFixed(1)
    };
    setAnalytics(mockAnalytics);
  }, [post]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h4 className="text-lg font-semibold mb-3">Post Analytics</h4>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Views */}
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {formatNumber(analytics.views)}
          </div>
          <div className="text-sm text-gray-600">Views</div>
        </div>

        {/* Likes */}
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {formatNumber(analytics.likes)}
          </div>
          <div className="text-sm text-gray-600">Likes</div>
        </div>

        {/* Comments */}
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {formatNumber(analytics.comments)}
          </div>
          <div className="text-sm text-gray-600">Comments</div>
        </div>

        {/* Shares */}
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {formatNumber(analytics.shares)}
          </div>
          <div className="text-sm text-gray-600">Shares</div>
        </div>
      </div>

      {/* Engagement Rate */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Engagement Rate</span>
          <span className="text-lg font-bold text-gray-900">{analytics.engagementRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(analytics.engagementRate, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="mt-4">
        <h5 className="text-sm font-semibold text-gray-700 mb-2">Performance Insights</h5>
        <div className="space-y-2 text-sm">
          {analytics.engagementRate > 5 && (
            <div className="flex items-center text-green-600">
              <i className="fas fa-arrow-up mr-2"></i>
              <span>High engagement! Your post is performing well.</span>
            </div>
          )}
          {analytics.views > 500 && (
            <div className="flex items-center text-blue-600">
              <i className="fas fa-eye mr-2"></i>
              <span>Great reach! Your post has been seen by many users.</span>
            </div>
          )}
          {analytics.comments > 10 && (
            <div className="flex items-center text-purple-600">
              <i className="fas fa-comments mr-2"></i>
              <span>Active discussion! Users are engaging with your content.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostAnalytics; 