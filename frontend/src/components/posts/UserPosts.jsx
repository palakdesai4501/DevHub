import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePosts } from '../../context/PostsContext';
import { useProfile } from '../../context/ProfileContext';
import PostItem from './PostItem';

const UserPosts = () => {
  const { userId } = useParams();
  const { posts, loading, error, getPosts } = usePosts();
  const { profile, loading: profileLoading, getProfileById } = useProfile();
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    getPosts();
    getProfileById(userId);
  }, [getPosts, getProfileById, userId]);

  useEffect(() => {
    if (posts.length > 0) {
      const filtered = posts.filter(post => post.user === userId);
      setUserPosts(filtered);
    }
  }, [posts, userId]);

  if (loading || profileLoading) {
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

  if (!profile) {
    return (
      <div className="container py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">User Not Found</h2>
            <p className="text-gray-600">The user you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <div className="max-w-4xl mx-auto">
        {/* User Profile Header */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex items-center mb-4">
            <div className="w-20 h-20 bg-gray-300 rounded-full mr-6 flex items-center justify-center">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.user.name} className="w-20 h-20 rounded-full" />
              ) : (
                <span className="text-gray-600 font-semibold text-2xl">{profile.user.name?.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">{profile.user.name}</h1>
              <p className="text-gray-600 text-lg">{profile.status}</p>
              {profile.company && (
                <p className="text-gray-500">at {profile.company}</p>
              )}
              {profile.location && (
                <p className="text-gray-500">{profile.location}</p>
              )}
            </div>
          </div>
          
          {profile.bio && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-gray-700">{profile.bio}</p>
            </div>
          )}

          {profile.skills && profile.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Posts Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Posts by {profile.user.name}</h2>
            <span className="text-gray-500">{userPosts.length} posts</span>
          </div>

          {userPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Posts Yet</h3>
              <p className="text-gray-500">
                {profile.user.name} hasn't created any posts yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {userPosts.map(post => (
                <PostItem key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPosts; 