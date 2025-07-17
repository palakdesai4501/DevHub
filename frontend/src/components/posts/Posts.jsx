import { useEffect, useState, useMemo } from 'react';
import { usePosts } from '../../context/PostsContext';
import { useAuth } from '../../context/AuthContext';
import PostForm from './PostForm';
import PostItem from './PostItem';
import PostSearch from './PostSearch';
import TrendingPosts from './TrendingPosts';

const Posts = () => {
  const { user } = useAuth();
  const { posts, loading, error, getPosts } = usePosts();
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: '',
    filterBy: 'all',
    sortBy: 'newest'
  });

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  // Filter and sort posts based on search criteria
  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    // Filter by search term
    if (searchFilters.searchTerm) {
      filtered = filtered.filter(post => 
        post.text.toLowerCase().includes(searchFilters.searchTerm.toLowerCase()) ||
        post.name.toLowerCase().includes(searchFilters.searchTerm.toLowerCase())
      );
    }

    // Filter by type
    switch (searchFilters.filterBy) {
      case 'my-posts':
        filtered = filtered.filter(post => post.user === user._id);
        break;
      case 'liked-posts':
        filtered = filtered.filter(post => post.likes.some(like => like.user === user._id));
        break;
      case 'commented-posts':
        filtered = filtered.filter(post => post.comments.some(comment => comment.user === user._id));
        break;
      default:
        break;
    }

    // Sort posts
    switch (searchFilters.sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'most-liked':
        filtered.sort((a, b) => b.likes.length - a.likes.length);
        break;
      case 'most-commented':
        filtered.sort((a, b) => b.comments.length - a.comments.length);
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
    }

    return filtered;
  }, [posts, searchFilters, user._id]);

  const handleSearch = (filters) => {
    setSearchFilters(filters);
  };

  const handleClearSearch = () => {
    setSearchFilters({
      searchTerm: '',
      filterBy: 'all',
      sortBy: 'newest'
    });
  };

  if (loading) {
    return (
      <div className="container py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Posts</h1>
        
        {/* Trending Posts */}
        <TrendingPosts />
        
        {/* Search and Filter */}
        <PostSearch onSearch={handleSearch} onClear={handleClearSearch} />
        
        {/* Post Form */}
        <PostForm />
        
        {/* Posts Feed */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                {posts.length === 0 
                  ? "No posts found. Be the first to create a post!"
                  : "No posts match your search criteria."
                }
              </p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <PostItem key={post._id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts; 