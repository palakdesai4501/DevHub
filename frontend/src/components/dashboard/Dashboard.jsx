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
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Dashboard
        </h1>
        
        <div className="mb-6">
          <p className="text-xl text-gray-600">
            <i className="fas fa-user mr-2"></i>
            Welcome {user && user.name}
          </p>
        </div>

        {profile !== null ? (
          // User has a profile
          <div className="space-y-8">
            {/* Profile Actions */}
            <div className="bg-white p-6 rounded-lg shadow card-animate">
              <h2 className="text-xl font-semibold mb-4">Profile Actions</h2>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/edit-profile" 
                  className="px-4 py-2 btn text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <i className="fas fa-user-circle mr-2"></i>
                  Edit Profile
                </Link>
                <Link 
                  to="/add-experience" 
                  className="px-4 py-2 btn text-white rounded hover:bg-green-700 transition-colors"
                >
                  <i className="fas fa-briefcase mr-2"></i>
                  Add Experience
                </Link>
                <Link 
                  to="/add-education" 
                  className="px-4 py-2 btn text-white rounded hover:bg-purple-700 transition-colors"
                >
                  <i className="fas fa-graduation-cap mr-2"></i>
                  Add Education
                </Link>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-white p-6 rounded-lg shadow card-animate">
              <h2 className="text-xl font-semibold mb-4">Profile Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 mb-2"><strong>Status:</strong> {profile.status}</p>
                  <p className="text-gray-600 mb-2"><strong>Company:</strong> {profile.company || 'Not specified'}</p>
                  <p className="text-gray-600 mb-2"><strong>Location:</strong> {profile.location || 'Not specified'}</p>
                  {profile.website && (
                    <p className="text-gray-600 mb-2">
                      <strong>Website:</strong> 
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-1">
                        {profile.website}
                      </a>
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-gray-600 mb-2"><strong>Skills:</strong></p>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {profile.bio && (
                <div className="mt-4">
                  <p className="text-gray-600"><strong>Bio:</strong></p>
                  <p className="text-gray-700 mt-1">{profile.bio}</p>
                </div>
              )}
            </div>

            {/* Experience */}
            {profile.experience && profile.experience.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow card-animate">
                <h2 className="text-xl font-semibold mb-4">Experience</h2>
                <div className="space-y-4">
                  {profile.experience.map((exp) => (
                    <div key={exp._id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                          <p className="text-gray-500 text-sm">
                            {new Date(exp.from).toLocaleDateString()} - {exp.current ? 'Current' : new Date(exp.to).toLocaleDateString()}
                          </p>
                          {exp.description && <p className="text-gray-700 mt-2">{exp.description}</p>}
                        </div>
                        <button 
                          onClick={() => handleDeleteExperience(exp._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Experience"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {profile.education && profile.education.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow card-animate">
                <h2 className="text-xl font-semibold mb-4">Education</h2>
                <div className="space-y-4">
                  {profile.education.map((edu) => (
                    <div key={edu._id} className="border-l-4 border-green-500 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{edu.school}</h3>
                          <p className="text-gray-600">{edu.degree} in {edu.fieldofstudy}</p>
                          <p className="text-gray-500 text-sm">
                            {new Date(edu.from).toLocaleDateString()} - {edu.current ? 'Current' : new Date(edu.to).toLocaleDateString()}
                          </p>
                          {edu.description && <p className="text-gray-700 mt-2">{edu.description}</p>}
                        </div>
                        <button 
                          onClick={() => handleDeleteEducation(edu._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Education"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg card-animate">
              <h2 className="text-xl font-semibold text-red-800 mb-4">Danger Zone</h2>
              <p className="text-red-600 mb-4">
                Delete your account and profile. This action cannot be undone.
              </p>
              <button 
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                <i className="fas fa-user-minus mr-2"></i>
                Delete My Account
              </button>
            </div>
          </div>
        ) : (
          // User doesn't have a profile yet
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-center card-animate">
            <i className="fas fa-user text-blue-600 text-4xl mb-4"></i>
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              You have not yet set up a profile
            </h2>
            <p className="text-blue-600 mb-6">
              Please add some info to let other developers know about you
            </p>
            <Link 
              to="/create-profile" 
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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