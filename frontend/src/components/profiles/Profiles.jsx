import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';

const Profiles = () => {
  const { profiles, loading, getProfiles } = useProfile();

  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  if (loading) {
    return (
      <div className="container py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderBottomColor: 'var(--color-primary)' }}></div>
          <p className="mt-4">Loading developer profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Developers</h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Browse and connect with developers
        </p>
        
        {profiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <div key={profile._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow card-animate">
                <div className="text-center">
                  {/* Avatar placeholder */}
                  <div className="w-20 h-20 bg-gradient-to-r rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {profile.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Name and Status */}
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {profile.user.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{profile.status}</p>
                  
                  {/* Company and Location */}
                  {profile.company && (
                    <p className="text-gray-500 text-sm mb-1">
                      <i className="fas fa-building mr-1"></i>
                      {profile.company}
                    </p>
                  )}
                  {profile.location && (
                    <p className="text-gray-500 text-sm mb-4">
                      <i className="fas fa-map-marker-alt mr-1"></i>
                      {profile.location}
                    </p>
                  )}
                  
                  {/* Skills */}
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {profile.skills.slice(0, 4).map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 rounded text-sm"
                        style={{ background: 'var(--color-accent)', color: 'var(--color-primary)' }}
                      >
                        {skill}
                      </span>
                    ))}
                    {profile.skills.length > 4 && (
                      <span className="text-gray-500 text-sm">
                        +{profile.skills.length - 4} more
                      </span>
                    )}
                  </div>
                  
                  {/* View Profile Button */}
                  <Link 
                    to={`/profile/${profile.user._id}`} 
                    className="inline-block w-full px-4 py-2 text-white rounded transition-colors"
                    style={{ background: 'var(--color-primary)' }}
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <i className="fas fa-users text-gray-400 text-6xl mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No developer profiles found
            </h3>
            <p className="text-gray-500">
              Be the first to create a profile and connect with other developers!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profiles; 