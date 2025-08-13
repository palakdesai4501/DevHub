import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Initialize Google Sign-In
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (!window.google || !import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        console.warn('Google Sign-In not available');
        return;
      }

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            setLoading(true);
            const res = await api.post('/auth/google', { credential: response.credential });
            localStorage.setItem('token', res.data.token);
            // The auth context will update and trigger navigation
            window.location.reload(); // Force a reload to update auth state
          } catch (error) {
            console.error('Google login error:', error);
            setErrors({ general: 'Google login failed. Please try again.' });
          } finally {
            setLoading(false);
          }
        },
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { 
          theme: 'outline', 
          size: 'large', 
          text: 'continue_with',
          width: 300
        }
      );
    };

    // Wait for Google script to load
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      const checkGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogle);
          initializeGoogleSignIn();
        }
      }, 100);

      // Clean up interval after 10 seconds
      setTimeout(() => clearInterval(checkGoogle), 10000);
    }
  }, [navigate]);

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
    
    // Basic validation
    if (!email || !password) {
      setErrors({ general: 'Please fill in all fields' });
      return;
    }

    if (!email.includes('@')) {
      setErrors({ email: 'Please enter a valid email' });
      return;
    }

    setLoading(true);
    
    try {
      await login(email, password);
      // Navigation will happen automatically via useEffect when isAuthenticated changes
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--color-primary)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--color-secondary)]">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-secondary)]">
            Create one now
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10 card-animate" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          <form className="space-y-6" onSubmit={onSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {errors.general}
                {errors.general.includes('Invalid Credentials') && (
                  <div className="mt-2 text-sm">
                    <p>Tips:</p>
                    <ul className="list-disc ml-4">
                      <li>Check your email and password</li>
                      <li>Make sure you have registered this account</li>
                      <li><Link to="/register" className="underline" style={{ color: 'var(--color-primary)' }}>Create a new account</Link></li>
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={onChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  style={{ borderColor: 'var(--color-accent)' }}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={onChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  style={{ borderColor: 'var(--color-accent)' }}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 rounded"
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium" style={{ color: 'var(--color-primary)' }}>
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading 
                    ? 'cursor-not-allowed' 
                    : 'btn cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-accent)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[var(--color-secondary)]">
                  Welcome back to DevHub
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <div id="googleSignInDiv" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 