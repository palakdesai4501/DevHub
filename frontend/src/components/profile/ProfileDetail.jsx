import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import FollowButton from './FollowButton';

const ProfileDetail = () => {
  const { id } = useParams();
  const { profile, loading, getProfileById } = useProfile();

  useEffect(() => {
    getProfileById(id);
  }, [getProfileById, id]);

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

  if (!profile) {
    return (
      <div className="container py-20">
        <div className="text-center">
          <i className="fas fa-user-slash text-gray-400 text-6xl mb-4"></i>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Profile Not Found</h2>
          <Link to="/profiles" className="text-blue-600 hover:text-blue-800">
            ← Back to Profiles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <div className="max-w-6xl mx-auto">
        {/* Back to Profiles */}
        <Link 
          to="/profiles" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Profiles
        </Link>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row items-center">
            {/* Avatar */}
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-8">
              <span className="text-4xl font-bold">
                {profile.user.name.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{profile.user.name}</h1>
              <p className="text-xl mb-2">{profile.status}</p>
              
              {profile.company && (
                <p className="text-lg mb-2">
                  <i className="fas fa-building mr-2"></i>
                  {profile.company}
                </p>
              )}
              
              {profile.location && (
                <p className="text-lg mb-4">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  {profile.location}
                </p>
              )}

              {/* Follow Button */}
              <div className="mt-4">
                <FollowButton 
                  userId={profile.user._id} 
                  userName={profile.user.name}
                  initialFollowers={0}
                />
              </div>

              {/* Social Links */}
              <div className="flex justify-center md:justify-start space-x-4">
                {profile.website && (
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-200 text-xl"
                  >
                    <i className="fas fa-globe"></i>
                  </a>
                )}
                {profile.social?.linkedin && (
                  <a 
                    href={profile.social.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-200 text-xl"
                  >
                    <i className="fab fa-linkedin"></i>
                  </a>
                )}
                {profile.social?.github && (
                  <a 
                    href={profile.social.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-200 text-xl"
                  >
                    <i className="fab fa-github"></i>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - About & Skills */}
          <div className="lg:col-span-1 space-y-6">
            {/* Bio */}
            {profile.bio && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  <i className="fas fa-user mr-2 text-blue-600"></i>
                  About
                </h3>
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Skills */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                <i className="fas fa-code mr-2 text-blue-600"></i>
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Experience & Education */}
          <div className="lg:col-span-2 space-y-6">
            {/* Experience */}
            {profile.experience && profile.experience.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">
                  <i className="fas fa-briefcase mr-2 text-blue-600"></i>
                  Experience
                </h3>
                <div className="space-y-6">
                  {profile.experience.map((exp, index) => (
                    <div key={exp._id} className="relative">
                      {/* Timeline line */}
                      {index !== profile.experience.length - 1 && (
                        <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                      )}
                      
                      <div className="flex">
                        {/* Timeline dot */}
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                          <i className="fas fa-briefcase text-white text-sm"></i>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{exp.title}</h4>
                          <p className="text-blue-600 font-medium">{exp.company}</p>
                          <p className="text-gray-500 text-sm mb-2">
                            {new Date(exp.from).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long' 
                            })} - {exp.current ? 'Present' : new Date(exp.to).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long' 
                            })}
                          </p>
                          {exp.location && (
                            <p className="text-gray-500 text-sm mb-2">
                              <i className="fas fa-map-marker-alt mr-1"></i>
                              {exp.location}
                            </p>
                          )}
                          {exp.description && (
                            <p className="text-gray-700 mt-2">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {profile.education && profile.education.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">
                  <i className="fas fa-graduation-cap mr-2 text-blue-600"></i>
                  Education
                </h3>
                <div className="space-y-6">
                  {profile.education.map((edu, index) => (
                    <div key={edu._id} className="relative">
                      {/* Timeline line */}
                      {index !== profile.education.length - 1 && (
                        <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                      )}
                      
                      <div className="flex">
                        {/* Timeline dot */}
                        <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-4">
                          <i className="fas fa-graduation-cap text-white text-sm"></i>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{edu.school}</h4>
                          <p className="text-green-600 font-medium">{edu.degree}</p>
                          <p className="text-gray-600">Field of Study: {edu.fieldofstudy}</p>
                          <p className="text-gray-500 text-sm mb-2">
                            {new Date(edu.from).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long' 
                            })} - {edu.current ? 'Present' : new Date(edu.to).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long' 
                            })}
                          </p>
                          {edu.description && (
                            <p className="text-gray-700 mt-2">{edu.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GitHub Repos */}
            {profile.githubusername && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  <i className="fab fa-github mr-2 text-gray-800"></i>
                  GitHub Repositories
                </h3>
                <p className="text-gray-600 mb-4">
                  Check out {profile.user.name}'s latest repositories on GitHub
                </p>
                <a 
                  href={`https://github.com/${profile.githubusername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
                >
                  <i className="fab fa-github mr-2"></i>
                  View GitHub Profile
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail; 