import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { profile, loading, getCurrentProfile, deleteAccount, deleteExperience, deleteEducation } = useProfile();

  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  const handleDeleteExperience = async (id) => {
    try {
      await deleteExperience(id);
      toast.success('Experience deleted!');
    } catch {
      toast.error('Failed to delete experience.');
    }
  };

  const handleDeleteEducation = async (id) => {
    try {
      await deleteEducation(id);
      toast.success('Education deleted!');
    } catch {
      toast.error('Failed to delete education.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        await deleteAccount();
        toast.success('Account deleted!');
      } catch {
        toast.error('Failed to delete account.');
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderBottomColor: 'var(--color-primary)' }}></div>
          <p className="mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
          Dashboard
        </h1>
        
        <div className="mb-4 md:mb-6">
          <p className="text-lg md:text-xl text-gray-600">
            <i className="fas fa-user mr-2"></i>
            Welcome {user && user.name}
          </p>
        </div>

        {profile !== null ? (
          // User has a profile
          <div className="space-y-8">
            {/* Profile Actions */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow card-animate">
              <h2 className="text-lg md:text-xl font-semibold mb-4">Profile Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <Link 
                  to="/edit-profile" 
                  className="px-3 py-2 md:px-4 md:py-2 btn text-white rounded transition-colors text-sm md:text-base text-center"
                >
                  <i className="fas fa-user-circle mr-2"></i>
                  Edit Profile
                </Link>
                <Link 
                  to="/add-experience" 
                  className="px-3 py-2 md:px-4 md:py-2 btn text-white rounded transition-colors text-sm md:text-base text-center"
                >
                  <i className="fas fa-briefcase mr-2"></i>
                  Add Experience
                </Link>
                <Link 
                  to="/add-education" 
                  className="px-3 py-2 md:px-4 md:py-2 btn text-white rounded transition-colors text-sm md:text-base text-center sm:col-span-2 lg:col-span-1"
                >
                  <i className="fas fa-graduation-cap mr-2"></i>
                  Add Education
                </Link>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow card-animate">
              <h2 className="text-lg md:text-xl font-semibold mb-4">Profile Summary</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <p className="text-gray-600 mb-2 text-sm md:text-base"><strong>Status:</strong> {profile.status}</p>
                  <p className="text-gray-600 mb-2 text-sm md:text-base"><strong>Company:</strong> {profile.company || 'Not specified'}</p>
                  <p className="text-gray-600 mb-2 text-sm md:text-base"><strong>Location:</strong> {profile.location || 'Not specified'}</p>
                  {profile.website && (
                    <p className="text-gray-600 mb-2 text-sm md:text-base">
                      <strong>Website:</strong> 
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="ml-1 break-all" style={{ color: 'var(--color-primary)' }}>
                        {profile.website}
                      </a>
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-gray-600 mb-2 text-sm md:text-base"><strong>Skills:</strong></p>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 rounded text-xs md:text-sm" style={{ background: 'var(--color-accent)', color: 'var(--color-primary)' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {profile.bio && (
                <div className="mt-4">
                  <p className="text-gray-600 text-sm md:text-base"><strong>Bio:</strong></p>
                  <p className="text-gray-700 mt-1 text-sm md:text-base">{profile.bio}</p>
                </div>
              )}
            </div>

            {/* Experience */}
            {profile.experience && profile.experience.length > 0 && (
              <div className="bg-white p-4 md:p-6 rounded-lg shadow card-animate">
                <h2 className="text-lg md:text-xl font-semibold mb-4">Experience</h2>
                <div className="space-y-4">
                  {profile.experience.map((exp) => (
                    <div key={exp._id} className="border-l-4 pl-3 md:pl-4" style={{ borderColor: 'var(--color-primary)' }}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm md:text-base">{exp.title}</h3>
                          <p className="text-gray-600 text-sm md:text-base">{exp.company}</p>
                          <p className="text-gray-500 text-xs md:text-sm">
                            {new Date(exp.from).toLocaleDateString()} - {exp.current ? 'Current' : new Date(exp.to).toLocaleDateString()}
                          </p>
                          {exp.description && <p className="text-gray-700 mt-2 text-sm md:text-base">{exp.description}</p>}
                        </div>
                        <button 
                          onClick={() => handleDeleteExperience(exp._id)}
                          className="text-red-600 hover:text-red-800 ml-2 flex-shrink-0"
                          title="Delete Experience"
                        >
                          <i className="fas fa-times text-sm md:text-base"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {profile.education && profile.education.length > 0 && (
              <div className="bg-white p-4 md:p-6 rounded-lg shadow card-animate">
                <h2 className="text-lg md:text-xl font-semibold mb-4">Education</h2>
                <div className="space-y-4">
                  {profile.education.map((edu) => (
                    <div key={edu._id} className="border-l-4 pl-3 md:pl-4" style={{ borderColor: 'var(--color-primary)' }}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm md:text-base">{edu.school}</h3>
                          <p className="text-gray-600 text-sm md:text-base">{edu.degree} in {edu.fieldofstudy}</p>
                          <p className="text-gray-500 text-xs md:text-sm">
                            {new Date(edu.from).toLocaleDateString()} - {edu.current ? 'Current' : new Date(edu.to).toLocaleDateString()}
                          </p>
                          {edu.description && <p className="text-gray-700 mt-2 text-sm md:text-base">{edu.description}</p>}
                        </div>
                        <button 
                          onClick={() => handleDeleteEducation(edu._id)}
                          className="text-red-600 hover:text-red-800 ml-2 flex-shrink-0"
                          title="Delete Education"
                        >
                          <i className="fas fa-times text-sm md:text-base"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div className="bg-red-50 border border-red-200 p-4 md:p-6 rounded-lg card-animate">
              <h2 className="text-lg md:text-xl font-semibold text-red-800 mb-4">Danger Zone</h2>
              <p className="text-red-600 mb-4 text-sm md:text-base">
                Delete your account and profile. This action cannot be undone.
              </p>
              <button 
                onClick={handleDeleteAccount}
                className="px-3 py-2 md:px-4 md:py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm md:text-base"
              >
                <i className="fas fa-user-minus mr-2"></i>
                Delete My Account
              </button>
            </div>
          </div>
        ) : (
          // User doesn't have a profile yet
          <div className="p-4 md:p-6 rounded-lg text-center card-animate" style={{ background: 'var(--color-accent)' }}>
            <i className="fas fa-user text-3xl md:text-4xl mb-4" style={{ color: 'var(--color-primary)' }}></i>
            <h2 className="text-lg md:text-xl font-semibold mb-4" style={{ color: 'var(--color-primary)' }}>
              You have not yet set up a profile
            </h2>
            <p className="mb-6 text-sm md:text-base" style={{ color: 'var(--color-primary)' }}>
              Please add some info to let other developers know about you
            </p>
            <Link 
              to="/create-profile" 
              className="inline-block px-4 py-2 md:px-6 md:py-3 text-white rounded-lg transition-colors text-sm md:text-base"
              style={{ background: 'var(--color-primary)' }}
            >
              <i className="fas fa-user-plus mr-2"></i>
              Create Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 