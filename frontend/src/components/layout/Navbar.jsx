import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user, loading } = useAuth();
  const location = useLocation();

  const onLogout = () => {
    logout();
  };

  const authLinks = (
    <ul className="flex items-center space-x-6">
      <li>
        <Link 
          to="/profiles" 
          className={`text-white hover:text-gray-300 transition-colors ${
            location.pathname === '/profiles' ? 'text-yellow-300' : ''
          }`}
        >
          Developers
        </Link>
      </li>
      <li>
        <Link 
          to="/posts" 
          className={`text-white hover:text-gray-300 transition-colors ${
            location.pathname === '/posts' ? 'text-yellow-300' : ''
          }`}
        >
          Posts
        </Link>
      </li>
      <li>
        <Link 
          to="/notifications" 
          className={`text-white hover:text-gray-300 transition-colors relative ${
            location.pathname === '/notifications' ? 'text-yellow-300' : ''
          }`}
        >
          <i className="fas fa-bell mr-1"></i>
          Notifications
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            2
          </span>
        </Link>
      </li>
      <li>
        <Link 
          to="/dashboard" 
          className={`text-white hover:text-gray-300 transition-colors ${
            location.pathname === '/dashboard' ? 'text-yellow-300' : ''
          }`}
        >
          <i className="fas fa-user mr-1"></i>
          Dashboard
        </Link>
      </li>
      <li>
        <button
          onClick={onLogout}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <i className="fas fa-sign-out-alt mr-1"></i>
          Logout
        </button>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul className="flex items-center space-x-6">
      <li>
        <Link 
          to="/profiles" 
          className={`text-white hover:text-gray-300 transition-colors ${
            location.pathname === '/profiles' ? 'text-yellow-300' : ''
          }`}
        >
          Developers
        </Link>
      </li>
      <li>
        <Link 
          to="/register" 
          className={`text-white hover:text-gray-300 transition-colors ${
            location.pathname === '/register' ? 'text-yellow-300' : ''
          }`}
        >
          Register
        </Link>
      </li>
      <li>
        <Link 
          to="/login" 
          className={`text-white hover:text-gray-300 transition-colors ${
            location.pathname === '/login' ? 'text-yellow-300' : ''
          }`}
        >
          Login
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <i className="fas fa-code text-white text-xl mr-2"></i>
              <span className="text-white text-xl font-bold">DevConnector</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {/* Show user name if authenticated */}
            {!loading && isAuthenticated && user && (
              <span className="text-white mr-4">
                Welcome, {user.name}!
              </span>
            )}
            
            {/* Show different links based on auth status */}
            {!loading && (
              <>
                {isAuthenticated ? authLinks : guestLinks}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 