import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const FollowButton = ({ userId, userName, initialFollowers = 0 }) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(initialFollowers);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if current user is following this user
    const following = JSON.parse(localStorage.getItem(`following_${user._id}`) || '[]');
    setIsFollowing(following.includes(userId));
    // Get followers count
    const followers = JSON.parse(localStorage.getItem(`followers_${userId}`) || '[]');
    setFollowersCount(followers.length);
  }, [userId, user._id]);

  const handleFollow = async () => {
    if (userId === user._id) return; // Can't follow yourself
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const following = JSON.parse(localStorage.getItem(`following_${user._id}`) || '[]');
      const followers = JSON.parse(localStorage.getItem(`followers_${userId}`) || '[]');
      if (isFollowing) {
        // Unfollow
        const newFollowing = following.filter(id => id !== userId);
        const newFollowers = followers.filter(id => id !== user._id);
        localStorage.setItem(`following_${user._id}`, JSON.stringify(newFollowing));
        localStorage.setItem(`followers_${userId}`, JSON.stringify(newFollowers));
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
        toast('Unfollowed ' + userName, { icon: '👋', style: { background: 'var(--color-accent)', color: 'var(--color-primary)' } });
      } else {
        // Follow
        const newFollowing = [...following, userId];
        const newFollowers = [...followers, user._id];
        localStorage.setItem(`following_${user._id}`, JSON.stringify(newFollowing));
        localStorage.setItem(`followers_${userId}`, JSON.stringify(newFollowers));
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        toast.success('You are now following ' + userName + '!');
      }
    } catch (error) {
      toast.error('Error following/unfollowing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (userId === user._id) {
    return null; // Don't show follow button for own profile
  }

  return (
    <div className="flex items-center space-x-3 card-animate space-y-2">
      <button
        onClick={handleFollow}
        disabled={loading}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          isFollowing
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            <span>Loading...</span>
          </div>
        ) : (
          <span>{isFollowing ? 'Following' : 'Follow'}</span>
        )}
      </button>
      <span className="text-sm text-white-500">
        {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
      </span>
    </div>
  );
};

export default FollowButton; 