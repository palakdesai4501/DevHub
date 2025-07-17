import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';

const AddExperience = () => {
  const navigate = useNavigate();
  const { addExperience, loading } = useProfile();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: ''
  });

  const [errors, setErrors] = useState({});

  const { title, company, location, from, to, current, description } = formData;

  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    
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
    
    if (!title.trim()) {
      newErrors.title = 'Job title is required';
    }
    
    if (!company.trim()) {
      newErrors.company = 'Company name is required';
    }
    
    if (!from) {
      newErrors.from = 'From date is required';
    }
    
    if (!current && !to) {
      newErrors.to = 'To date is required unless this is your current job';
    }
    
    if (from && to && new Date(from) >= new Date(to)) {
      newErrors.to = 'To date must be after from date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Prepare data for submission
      const experienceData = {
        title,
        company,
        location,
        from,
        current,
        description
      };
      
      // Only include 'to' date if not current job
      if (!current && to) {
        experienceData.to = to;
      }

      await addExperience(experienceData);
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
      }
    }
  };

  return (
    <div className="container py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add Experience</h1>
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8">
          <i className="fas fa-briefcase text-blue-600 mr-2"></i>
          <strong className="text-blue-800">
            Add any developer/programming positions that you have had in the past
          </strong>
        </div>

        <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              {errors.general}
            </div>
          )}

          {/* Job Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-user-tie mr-2"></i>
              Job Title *
            </label>
            <input
              type="text"
              placeholder="Job Title"
              name="title"
              value={title}
              onChange={onChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Company */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-building mr-2"></i>
              Company *
            </label>
            <input
              type="text"
              placeholder="Company"
              name="company"
              value={company}
              onChange={onChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.company ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.company && (
              <p className="mt-2 text-sm text-red-600">{errors.company}</p>
            )}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <small className="text-gray-500">
              City & state suggested (eg. Boston, MA)
            </small>
          </div>

          {/* From Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-calendar-alt mr-2"></i>
              From Date *
            </label>
            <input
              type="date"
              name="from"
              value={from}
              onChange={onChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.from ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.from && (
              <p className="mt-2 text-sm text-red-600">{errors.from}</p>
            )}
          </div>

          {/* Current Job Checkbox */}
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="current"
                name="current"
                checked={current}
                onChange={onChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="current" className="ml-2 block text-sm text-gray-900">
                This is my current job
              </label>
            </div>
          </div>

          {/* To Date */}
          {!current && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-calendar-alt mr-2"></i>
                To Date *
              </label>
              <input
                type="date"
                name="to"
                value={to}
                onChange={onChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.to ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.to && (
                <p className="mt-2 text-sm text-red-600">{errors.to}</p>
              )}
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-align-left mr-2"></i>
              Job Description
            </label>
            <textarea
              placeholder="Job Description"
              name="description"
              value={description}
              onChange={onChange}
              rows="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
            <small className="text-gray-500">
              Tell us about your responsibilities and achievements
            </small>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-md text-white font-medium ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
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

export default AddExperience; 