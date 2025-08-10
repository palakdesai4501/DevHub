import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import toast from 'react-hot-toast';

const ProfileForm = ({ edit = false }) => {
  const navigate = useNavigate();
  const { profile, createProfile, loading } = useProfile();

  const [formData, setFormData] = useState({
    company: '',
    website: '',
    location: '',
    status: '',
    skills: '',
    githubusername: '',
    bio: '',
    linkedin: '',
    github: ''
  });

  const [errors, setErrors] = useState({});
  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  const {
    company,
    website,
    location,
    status,
    skills,
    githubusername,
    bio,
    linkedin,
    github
  } = formData;

  useEffect(() => {
    // If editing and profile exists, populate form
    if (edit && profile) {
      const profileData = { ...formData };
      
      for (const key in profile) {
        if (key in profileData) {
          profileData[key] = profile[key];
        }
      }
      
      // Handle skills array
      if (profile.skills) {
        profileData.skills = profile.skills.join(', ');
      }
      
      // Handle social object
      if (profile.social) {
        profileData.linkedin = profile.social.linkedin || '';
        profileData.github = profile.social.github || '';
      }
      
      setFormData(profileData);
    }
  }, [edit, profile]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validation
    const newErrors = {};
    
    if (!status) {
      newErrors.status = 'Status is required';
    }
    
    if (!skills) {
      newErrors.skills = 'Skills are required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createProfile(formData);
      toast.success(edit ? 'Profile updated!' : 'Profile created!');
      navigate('/dashboard');
    } catch (error) {
      // Handle API errors
      if (error.response?.data?.errors) {
        const apiErrors = {};
        error.response.data.errors.forEach(err => {
          apiErrors[err.param] = err.msg;
        });
        setErrors(apiErrors);
      } else {
        setErrors({ general: 'An error occurred. Please try again.' });
        toast.error('Failed to save profile.');
      }
    }
  };

  return (
    <div className="container py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {edit ? 'Edit Your Profile' : 'Create Your Profile'}
        </h1>
        
        <div className="p-4 rounded-lg mb-8" style={{ background: 'var(--color-accent)' }}>
          <i className="fas fa-user mr-2" style={{ color: 'var(--color-primary)' }}></i>
          <strong style={{ color: 'var(--color-primary)' }}>
            Let's get some information to make your profile stand out
          </strong>
        </div>

        <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow card-animate">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              {errors.general}
            </div>
          )}

          {/* Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-user-tie mr-2"></i>
              Professional Status *
            </label>
            <select
              name="status"
              value={status}
              onChange={onChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                errors.status ? 'border-red-300' : 'border-gray-300'
              }`}
              style={{ borderColor: 'var(--color-accent)' }}
            >
              <option value="">* Select Professional Status</option>
              <option value="Developer">Developer</option>
              <option value="Junior Developer">Junior Developer</option>
              <option value="Senior Developer">Senior Developer</option>
              <option value="Manager">Manager</option>
              <option value="Student or Learning">Student or Learning</option>
              <option value="Instructor">Instructor or Teacher</option>
              <option value="Intern">Intern</option>
              <option value="Other">Other</option>
            </select>
            {errors.status && (
              <p className="mt-2 text-sm text-red-600">{errors.status}</p>
            )}
            <small className="text-gray-500">
              Give us an idea of where you are at in your career
            </small>
          </div>

          {/* Company */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-building mr-2"></i>
              Company
            </label>
            <input
              type="text"
              placeholder="Company"
              name="company"
              value={company}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
              style={{ borderColor: 'var(--color-accent)' }}
            />
            <small className="text-gray-500">
              Could be your own company or one you work for
            </small>
          </div>

          {/* Website */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-globe mr-2"></i>
              Website
            </label>
            <input
              type="text"
              placeholder="Website"
              name="website"
              value={website}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
              style={{ borderColor: 'var(--color-accent)' }}
            />
            <small className="text-gray-500">
              Could be your own or a company website
            </small>
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-map-marker-alt mr-2"></i>
              Location
            </label>
            <input
              type="text"
              placeholder="Location"
              name="location"
              value={location}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
              style={{ borderColor: 'var(--color-accent)' }}
            />
            <small className="text-gray-500">
              City & state suggested (eg. Boston, MA)
            </small>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-code-branch mr-2"></i>
              Skills *
            </label>
            <input
              type="text"
              placeholder="Skills"
              name="skills"
              value={skills}
              onChange={onChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                errors.skills ? 'border-red-300' : 'border-gray-300'
              }`}
              style={{ borderColor: 'var(--color-accent)' }}
            />
            {errors.skills && (
              <p className="mt-2 text-sm text-red-600">{errors.skills}</p>
            )}
            <small className="text-gray-500">
              Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
            </small>
          </div>

          {/* GitHub Username */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fab fa-github mr-2"></i>
              GitHub Username
            </label>
            <input
              type="text"
              placeholder="GitHub Username"
              name="githubusername"
              value={githubusername}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
              style={{ borderColor: 'var(--color-accent)' }}
            />
            <small className="text-gray-500">
              If you want your latest repos and a GitHub link, include your username
            </small>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-user mr-2"></i>
              Bio
            </label>
            <textarea
              placeholder="A short bio of yourself"
              name="bio"
              value={bio}
              onChange={onChange}
              rows="5"
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
              style={{ borderColor: 'var(--color-accent)' }}
            ></textarea>
            <small className="text-gray-500">Tell us a little about yourself</small>
          </div>

          {/* Social Networks Toggle */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => toggleSocialInputs(!displaySocialInputs)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Add Social Network Links
            </button>
            <span className="ml-2 text-gray-500">Optional</span>
          </div>

          {/* Social Network Inputs */}
          {displaySocialInputs && (
            <div className="space-y-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fab fa-linkedin mr-2 text-blue-600"></i>
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  placeholder="LinkedIn URL"
                  name="linkedin"
                  value={linkedin}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fab fa-github mr-2"></i>
                  GitHub URL
                </label>
                <input
                  type="text"
                  placeholder="GitHub URL"
                  name="github"
                  value={github}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-md text-white font-medium ${
                loading ? 'cursor-not-allowed' : ''
              }`}
              style={{ background: loading ? 'var(--color-accent)' : 'var(--color-primary)' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Submit'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Go Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm; 